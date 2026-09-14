import { useState, useEffect } from 'react';
import api from '../services/api';

function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [productosConStockBajo, setProductosConStockBajo] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  function esLoteVencido(fechaVencimiento) {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(fechaVencimiento) < hoy;
  }

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const [resInventario, resStockBajo] = await Promise.all([
        api.get('/inventario'),
        api.get('/inventario/stock-bajo'),
      ]);
      setInventario(resInventario.data);
      setProductosConStockBajo(new Set(resStockBajo.data.map((item) => item.producto_id)));
    } catch (err) {
      setError('No se pudo cargar el inventario');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  if (cargando) return <p>Cargando inventario...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const filtrado = inventario.filter((item) =>
    (item.Producto?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.Lote?.numero_lote || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1>Inventario</h1>

      <input
        type="text"
        placeholder="Buscar por producto o número de lote..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '16px 0', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Producto</th>
            <th style={{ padding: '10px' }}>N° de lote</th>
            <th style={{ padding: '10px' }}>Vencimiento</th>
            <th style={{ padding: '10px' }}>Cantidad actual</th>
            <th style={{ padding: '10px' }}>Stock mínimo</th>
            <th style={{ padding: '10px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filtrado.map((item) => {
            const vencido = esLoteVencido(item.Lote?.fecha_vencimiento);
            const stockBajo = productosConStockBajo.has(item.producto_id);
            const resaltar = vencido || stockBajo;

            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: resaltar ? '#fee2e2' : 'transparent',
                }}
              >
                <td style={{ padding: '10px' }}>{item.Producto?.nombre || '—'}</td>
                <td style={{ padding: '10px' }}>{item.Lote?.numero_lote || '—'}</td>
                <td style={{ padding: '10px' }}>{item.Lote?.fecha_vencimiento || '—'}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.cantidad_actual}</td>
                <td style={{ padding: '10px' }}>{item.Producto?.stock_minimo ?? '—'}</td>
                <td style={{ padding: '10px' }}>
                  {vencido ? (
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>⚠ Vencido</span>
                  ) : stockBajo ? (
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⚠ Stock bajo (total)</span>
                  ) : (
                    <span style={{ color: '#16a34a' }}>OK</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtrado.length === 0 && <p style={{ marginTop: '12px' }}>No se encontraron resultados.</p>}
    </div>
  );
}

export default Inventario;