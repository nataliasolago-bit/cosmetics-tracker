const { Op } = require('sequelize');
const { Lote, Producto, Inventario, Movimiento, sequelize } = require('../models');

async function listarLotes(req,res) {
 try{res.json(await Lote.findAll({include:[Producto,Inventario]}));}
 catch(err){console.error(err);res.status(500).json({error:'Error al obtener lotes'});}
}
async function obtenerLote(req,res) {
 try{
  const lote=await Lote.findByPk(req.params.id,{include:[Producto,Inventario]});
  if(!lote)return res.status(404).json({error:'Lote no encontrado'});
  res.json(lote);
 }catch(err){console.error(err);res.status(500).json({error:'Error al obtener lote'});}
}
async function crearLote(req,res) {
 const {producto_id,numero_lote,fecha_fabricacion,fecha_vencimiento}=req.body;
 const cantidad_inicial=Number(req.body.cantidad_inicial);
 if(!producto_id||!numero_lote?.trim()||!fecha_fabricacion||!fecha_vencimiento||!Number.isSafeInteger(cantidad_inicial)||cantidad_inicial<0)
   return res.status(400).json({error:'Completa todos los campos; la cantidad inicial debe ser un entero no negativo'});
 if(Number.isNaN(Date.parse(fecha_fabricacion))||Number.isNaN(Date.parse(fecha_vencimiento))||fecha_vencimiento<fecha_fabricacion)
   return res.status(400).json({error:'Las fechas son inválidas o el vencimiento precede a la fabricación'});
 try{
  const resultado=await sequelize.transaction(async transaction=>{
    const producto=await Producto.findByPk(producto_id,{transaction});
    if(!producto){const e=new Error('Producto no encontrado');e.status=404;throw e;}
    const lote=await Lote.create({producto_id,numero_lote:numero_lote.trim(),fecha_fabricacion,fecha_vencimiento,cantidad_inicial},{transaction});
    const inventario=await Inventario.create({producto_id,lote_id:lote.id,cantidad_actual:cantidad_inicial},{transaction});
    const movimiento=cantidad_inicial>0?await Movimiento.create({producto_id,lote_id:lote.id,tipo:'entrada',cantidad:cantidad_inicial,motivo:'Alta de lote nuevo',usuario_id:req.usuario.id},{transaction}):null;
    return {lote,inventario,movimiento};
  });
  res.status(201).json(resultado);
 }catch(err){
  console.error(err);
  res.status(err.status||(err.name==='SequelizeUniqueConstraintError'?409:500)).json({error:err.status?err.message:err.name==='SequelizeUniqueConstraintError'?'Ese número de lote ya existe para el producto':'Error al crear el lote'});
 }
}
async function actualizarLote(req,res) {
 try{
  const lote=await Lote.findByPk(req.params.id);
  if(!lote)return res.status(404).json({error:'Lote no encontrado'});
  const {numero_lote,fecha_fabricacion,fecha_vencimiento}=req.body;
  const inicio=fecha_fabricacion||lote.fecha_fabricacion;
  const final=fecha_vencimiento||lote.fecha_vencimiento;
  if(final<inicio)return res.status(400).json({error:'Vencimiento anterior a fabricación'});
  await lote.update({...(numero_lote!==undefined?{numero_lote}:{}),...(fecha_fabricacion?{fecha_fabricacion}:{}),...(fecha_vencimiento?{fecha_vencimiento}:{})});
  res.json(lote);
 }catch(err){console.error(err);res.status(500).json({error:'Error al actualizar lote'});}
}
async function eliminarLote(req,res) {
 try{
  const lote=await Lote.findByPk(req.params.id);
  if(!lote)return res.status(404).json({error:'Lote no encontrado'});
  if(await Movimiento.count({where:{lote_id:lote.id}})>0||await Inventario.count({where:{lote_id:lote.id}})>0)return res.status(409).json({error:'No se puede eliminar un lote con historial o inventario asociado'});
  await lote.destroy();
  res.json({message:'Lote eliminado correctamente'});
 }catch(err){console.error(err);res.status(500).json({error:'Error al eliminar lote'});}
}
async function lotesVencidos(req,res) {
 try{res.json(await Lote.findAll({where:{fecha_vencimiento:{[Op.lt]:new Date()}},include:[Producto,Inventario]}));}
 catch(err){console.error(err);res.status(500).json({error:'Error al obtener vencidos'});}
}
async function lotesProximosAVencer(req,res) {
 try{
  const hoy=new Date();const en30=new Date(hoy);en30.setDate(en30.getDate()+30);
  res.json(await Lote.findAll({where:{fecha_vencimiento:{[Op.between]:[hoy,en30]}},include:[Producto,Inventario]}));
 }catch(err){console.error(err);res.status(500).json({error:'Error al obtener próximos a vencer'});}
}
module.exports={listarLotes,obtenerLote,crearLote,actualizarLote,eliminarLote,lotesVencidos,lotesProximosAVencer};
