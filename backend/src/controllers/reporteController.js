const {Producto,Lote,Inventario,Movimiento}=require('../models');
async function resumen(req,res){
 try{
  const [productos,lotes,movimientos,stocks]=await Promise.all([Producto.count(),Lote.findAll(),Movimiento.count(),Inventario.findAll()]);
  const hoy=new Date();const limite=new Date(hoy);limite.setDate(limite.getDate()+30);
  const totales=new Map();
  stocks.forEach(s=>totales.set(s.producto_id,(totales.get(s.producto_id)||0)+Number(s.cantidad_actual)));
  const prod=await Producto.findAll();
  const bajo=prod.filter(p=>(totales.get(p.id)||0)<=Number(p.stock_minimo)).length;
  const vencimiento=l=>new Date(String(l.fecha_vencimiento).slice(0,10)+'T23:59:59');
  res.json({productos,lotes:lotes.length,movimientos,unidades:stocks.reduce((sum,s)=>sum+Number(s.cantidad_actual),0),stock_bajo:bajo,lotes_vencidos:lotes.filter(l=>vencimiento(l)<hoy).length,lotes_proximos:lotes.filter(l=>vencimiento(l)>=hoy&&vencimiento(l)<=limite).length});
 }catch(e){console.error(e);res.status(500).json({error:'No se pudo generar el resumen'});}
}
function csv(rows,cols){
 const quote=v=>'"'+String(v??'').replace(/"/g,'""').replace(/^[=+@\-\t\r]/,x=>"'"+x)+'"';
 return '\uFEFF'+[cols.map(c=>quote(c[0])).join(','),...rows.map(r=>cols.map(c=>quote(c[1](r))).join(','))].join('\r\n');
}
async function exportar(req,res){
 const tipo=req.params.tipo;
 try{
  let rows,cols;
  if(tipo==='inventario'){
   rows=await Inventario.findAll({include:[Producto,Lote]});
   cols=[['Producto',r=>r.Producto?.nombre],['Lote',r=>r.Lote?.numero_lote],['Vencimiento',r=>r.Lote?.fecha_vencimiento],['Unidades',r=>r.cantidad_actual],['Stock mínimo',r=>r.Producto?.stock_minimo]];
  }else if(tipo==='movimientos'){
   rows=await Movimiento.findAll({include:[Producto,Lote],order:[['fecha','DESC']]});
   cols=[['Fecha',r=>r.fecha?.toISOString?.()||r.fecha],['Producto',r=>r.Producto?.nombre],['Lote',r=>r.Lote?.numero_lote],['Tipo',r=>r.tipo],['Cantidad',r=>r.cantidad],['Motivo',r=>r.motivo]];
  }else return res.status(404).json({error:'Reporte desconocido'});
  res.set('Content-Type','text/csv; charset=utf-8');
  res.set('Content-Disposition',`attachment; filename="reporte_${tipo}.csv"`);
  res.send(csv(rows,cols));
 }catch(e){console.error(e);res.status(500).json({error:'No se pudo exportar el reporte'});}
}
module.exports={resumen,exportar};
