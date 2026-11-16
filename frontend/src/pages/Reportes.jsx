import {useEffect,useState} from 'react';
import api from '../services/api';
import './Reportes.css';
export default function Reportes(){
 const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const cargar=async()=>{setLoading(true);setError('');try{setData((await api.get('/reportes/resumen')).data)}catch(e){setError(e.response?.data?.error||'No fue posible cargar las métricas')}finally{setLoading(false)}};
 useEffect(()=>{cargar()},[]);
 const descargar=async(tipo)=>{try{const res=await api.get(`/reportes/exportar/${tipo}`,{responseType:'blob'});const url=URL.createObjectURL(res.data);const a=document.createElement('a');a.href=url;a.download=`reporte_${tipo}.csv`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url)}catch(e){setError('No se pudo descargar el reporte')}};
 const indicadores=[['Productos','productos'],['Lotes','lotes'],['Unidades disponibles','unidades'],['Movimientos','movimientos'],['Productos con stock bajo','stock_bajo'],['Lotes vencidos','lotes_vencidos'],['Próximos a vencer (30 días)','lotes_proximos']];
 return <main className="report-page"><div className="report-top"><div><h1>Reportes y métricas</h1><p>Indicadores operativos en tiempo real para el control de inventario y trazabilidad.</p></div><button onClick={cargar} disabled={loading}>↻ Actualizar</button></div>{error&&<p className="report-error" role="alert">{error}</p>}{loading?<p>Cargando indicadores…</p>:data&&<section className="report-grid">{indicadores.map(([titulo,clave])=><article key={clave} className="report-card"><span>{titulo}</span><strong>{Number(data[clave]||0).toLocaleString('es-CO')}</strong></article>)}</section>}<section className="report-export"><h2>Exportación de evidencias</h2><p>Descarga reportes CSV compatibles con Excel. Los datos corresponden a la base conectada al servidor.</p><div className="report-actions"><button onClick={()=>descargar('inventario')}>↓ Exportar inventario CSV</button><button onClick={()=>descargar('movimientos')}>↓ Exportar movimientos CSV</button></div><small>Estos CSV son reportes, no reemplazan la exportación SQL Server exigida por el docente.</small></section></main>
}
