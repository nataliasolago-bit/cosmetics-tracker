const { Movimiento, Producto, Lote, Inventario, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');
const incluir = [Producto, Lote, Usuario];
async function listarMovimientos(req, res) {
  try {
    const where = {};
    if (req.query.tipo) {
      if (!['entrada','salida'].includes(req.query.tipo)) return res.status(400).json({error:'Tipo inválido'});
      where.tipo = req.query.tipo;
    }
    if (req.query.desde || req.query.hasta) {
      where.fecha = {};
      if (req.query.desde) { if (Number.isNaN(Date.parse(req.query.desde))) return res.status(400).json({error:'Fecha desde inválida'}); where.fecha[Op.gte] = new Date(req.query.desde); }
      if (req.query.hasta) { if (Number.isNaN(Date.parse(req.query.hasta))) return res.status(400).json({error:'Fecha hasta inválida'}); where.fecha[Op.lte] = new Date(req.query.hasta + (req.query.hasta.length === 10 ? 'T23:59:59.999' : '')); }
    }
    res.json(await Movimiento.findAll({where,include:incluir,order:[['fecha','DESC']]}));
  } catch(err) {console.error(err); res.status(500).json({error:'Error al obtener los movimientos'});}
}
async function movimientosPorProducto(req,res) {
 try {res.json(await Movimiento.findAll({where:{producto_id:req.params.productoId},include:[Lote,Usuario],order:[['fecha','DESC']]}));}
 catch(err){console.error(err);res.status(500).json({error:'Error al obtener historial'});}
}
async function movimientosPorLote(req,res) {
 try {res.json(await Movimiento.findAll({where:{lote_id:req.params.loteId},include:[Producto,Usuario],order:[['fecha','DESC']]}));}
 catch(err){console.error(err);res.status(500).json({error:'Error al obtener historial'});}
}
async function crearMovimiento(req,res) {
 const { producto_id,lote_id,tipo,motivo } = req.body;
 const cantidad = Number(req.body.cantidad);
 if (!Number.isSafeInteger(cantidad) || cantidad <= 0 || !['entrada','salida'].includes(tipo) || !Number.isInteger(Number(producto_id)) || !Number.isInteger(Number(lote_id)))
   return res.status(400).json({error:'Producto, lote, tipo y cantidad entera positiva son obligatorios'});
 try {
   const resultado = await sequelize.transaction(async transaction => {
     const lote = await Lote.findByPk(lote_id,{transaction});
     if (!lote || Number(lote.producto_id) !== Number(producto_id)) {const e=new Error('El lote no pertenece al producto indicado');e.status=400;throw e;}
     const inventario = await Inventario.findOne({where:{lote_id},transaction,lock:transaction.LOCK.UPDATE});
     if (!inventario || Number(inventario.producto_id)!==Number(producto_id)){const e=new Error('Inventario del lote no encontrado');e.status=404;throw e;}
     if (tipo==='salida' && new Date(lote.fecha_vencimiento+'T23:59:59') < new Date()) {const e=new Error('No se pueden retirar unidades de un lote vencido');e.status=400;throw e;}
     const actual = Number(inventario.cantidad_actual);
     if(tipo==='salida' && actual<cantidad){const e=new Error(`Stock insuficiente. Disponible: ${actual}`);e.status=400;throw e;}
     await inventario.update({cantidad_actual:actual+(tipo==='entrada'?cantidad:-cantidad),actualizado_en:new Date()},{transaction});
     const movimiento=await Movimiento.create({producto_id,lote_id,tipo,cantidad,motivo:motivo||null,usuario_id:req.usuario.id},{transaction});
     return {movimiento,inventario_actualizado:inventario};
   });
   res.status(201).json(resultado);
 } catch(err){console.error(err);res.status(err.status||500).json({error:err.status?err.message:'Error al registrar movimiento'});}
}
module.exports={listarMovimientos,movimientosPorProducto,movimientosPorLote,crearMovimiento};
