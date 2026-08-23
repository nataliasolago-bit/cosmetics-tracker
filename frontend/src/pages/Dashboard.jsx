import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [vencidos, setVencidos] = useState([]);
  const [proximosAVencer, setProximosAVencer] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resProductos, resVencidos, resProximos, resStockBajo] = await Promise.all([
          api.get('/productos'),
          api.get('/lotes/vencidos'),
          api.get('/lotes/proximos-a-vencer'),
          api.get('/inventario/stock-bajo'),
        ]);

        setProductos(resProductos.data);
        setVencidos(resVencidos.data);
        setProximosAVencer(resProximos.data);
        setStockBajo(resStockBajo.data);
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) return (
    <p style={{
      padding: '40px',
      textAlign: 'center',
      color: '#9b7b83',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    }}>
      Cargando dashboard...
    </p>
  );

  if (error) return (
    <p style={{
      margin: '32px',
      padding: '16px 20px',
      borderRadius: '12px',
      backgroundColor: '#fff3f4',
      border: '1px solid #f2d0d5',
      color: '#b94d5c',
      fontSize: '14px'
    }}>
      {error}
    </p>
  );

  return (
    <div style={{
      minHeight: '100%',
      padding: '32px',
      background: 'linear-gradient(135deg, #fff9fa 0%, #fdf3f5 100%)',
      fontFamily: 'Arial, sans-serif',
      color: '#4a353b'
    }}>
      <div style={{
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f0dfe3'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: '700',
          color: '#593f47',
          letterSpacing: '-0.5px'
        }}>
          Dashboard
        </h1>

        <p style={{
          margin: '7px 0 0',
          color: '#a5828b',
          fontSize: '14px'
        }}>
          Resumen general de tu inventario y productos
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '18px',
        margin: '0 0 32px'
      }}>
        <Tarjeta
          titulo="Productos"
          numero={productos.length}
          color="#c87587"
        />

        <Tarjeta
          titulo="Lotes vencidos"
          numero={vencidos.length}
          color="#c45f70"
        />

        <Tarjeta
          titulo="Próximos a vencer"
          numero={proximosAVencer.length}
          color="#c89563"
        />

        <Tarjeta
          titulo="Stock bajo"
          numero={stockBajo.length}
          color="#9675a3"
        />
      </div>

      {/* Detalle: lotes vencidos */}
      <SeccionDetalle titulo="Lotes vencidos">
        {vencidos.length === 0 ? (
          <p style={{
            margin: 0,
            color: '#9b7b83',
            fontSize: '14px'
          }}>
            No hay lotes vencidos.
          </p>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#684d56'
          }}>
            {vencidos.map((lote) => (
              <li
                key={lote.id}
                style={{
                  padding: '9px 0',
                  borderBottom: '1px solid #f3e8eb',
                  fontSize: '14px'
                }}
              >
                {lote.Producto?.nombre || 'Producto'} — Lote {lote.numero_lote} — Venció: {lote.fecha_vencimiento}
              </li>
            ))}
          </ul>
        )}
      </SeccionDetalle>

      {/* Detalle: próximos a vencer */}
      <SeccionDetalle titulo="Próximos a vencer">
        {proximosAVencer.length === 0 ? (
          <p style={{
            margin: 0,
            color: '#9b7b83',
            fontSize: '14px'
          }}>
            No hay lotes próximos a vencer.
          </p>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#684d56'
          }}>
            {proximosAVencer.map((lote) => (
              <li
                key={lote.id}
                style={{
                  padding: '9px 0',
                  borderBottom: '1px solid #f3e8eb',
                  fontSize: '14px'
                }}
              >
                {lote.Producto?.nombre || 'Producto'} — Lote {lote.numero_lote} — Vence: {lote.fecha_vencimiento}
              </li>
            ))}
          </ul>
        )}
      </SeccionDetalle>

      {/* Detalle: stock bajo */}
      <SeccionDetalle titulo="Productos con stock bajo">
        {stockBajo.length === 0 ? (
          <p style={{
            margin: 0,
            color: '#9b7b83',
            fontSize: '14px'
          }}>
            No hay productos con stock bajo.
          </p>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#684d56'
          }}>
            {stockBajo.map((item) => (
              <li
                key={item.producto_id}
                style={{
                  padding: '9px 0',
                  borderBottom: '1px solid #f3e8eb',
                  fontSize: '14px'
                }}
              >
                {item.Producto?.nombre || 'Producto'} — Stock total: {item.cantidad_total} (mínimo: {item.Producto?.stock_minimo})
              </li>
            ))}
          </ul>
        )}
      </SeccionDetalle>
    </div>
  );
}

function Tarjeta({ titulo, numero, color }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      color: 'white',
      padding: '22px 24px',
      borderRadius: '18px',
      minHeight: '115px',
      boxSizing: 'border-box',
      boxShadow: '0 8px 22px rgba(120, 76, 88, 0.12)'
    }}>
      <div style={{
        position: 'absolute',
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.10)',
        right: '-25px',
        top: '-30px'
      }} />

      <p style={{
        margin: 0,
        fontSize: '13px',
        opacity: 0.9,
        fontWeight: '600',
        letterSpacing: '0.3px'
      }}>
        {titulo}
      </p>

      <p style={{
        margin: '12px 0 0',
        fontSize: '32px',
        lineHeight: 1,
        fontWeight: '700'
      }}>
        {numero}
      </p>
    </div>
  );
}

function SeccionDetalle({ titulo, children }) {
  return (
    <div style={{
      marginBottom: '24px'
    }}>
      <h3 style={{
        margin: '0 0 10px',
        color: '#62464f',
        fontSize: '18px',
        fontWeight: '700'
      }}>
        {titulo}
      </h3>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px 22px',
        borderRadius: '16px',
        border: '1px solid #f1dfe4',
        boxShadow: '0 6px 20px rgba(120, 76, 88, 0.06)'
      }}>
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
