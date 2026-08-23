import { useState, useEffect } from 'react';
import api from '../services/api';

function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [productosConStockBajo, setProductosConStockBajo] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

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

  if (cargando) return (
    <p style={{
      padding: '40px',
      textAlign: 'center',
      color: '#9b7b83',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    }}>
      Cargando inventario...
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

  const filtrado = inventario.filter((item) =>
    (item.Producto?.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.Lote?.numero_lote || '').toLowerCase().includes(busqueda.toLowerCase())
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
        marginBottom: '26px',
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
          Inventario
        </h1>

        <p style={{
          margin: '7px 0 0',
          color: '#a5828b',
          fontSize: '14px'
        }}>
          Consulta el estado y disponibilidad de tus productos
        </p>
      </div>

      <div style={{
        marginBottom: '22px',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="Buscar por producto o número de lote..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #ead5da',
            backgroundColor: '#ffffff',
            color: '#4a353b',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 5px 16px rgba(120, 76, 88, 0.05)'
          }}
        />
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid #f1dfe4',
        boxShadow: '0 8px 25px rgba(120, 76, 88, 0.07)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff'
        }}>
          <thead>
            <tr style={{
              textAlign: 'left',
              backgroundColor: '#fdf4f6',
              borderBottom: '1px solid #eedde2'
            }}>
              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Producto
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                N° de lote
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Vencimiento
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Cantidad actual
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Stock mínimo
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Estado del producto
              </th>
            </tr>
          </thead>

          <tbody>
            {filtrado.map((item) => {
              const esBajo = productosConStockBajo.has(item.producto_id);

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f3e8eb',
                    backgroundColor: esBajo ? '#fff5f5' : '#ffffff'
                  }}
                >
                  <td style={{
                    padding: '17px 18px',
                    color: '#513b42',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {item.Producto?.nombre || '—'}
                  </td>

                  <td style={{
                    padding: '17px 18px',
                    color: '#806871',
                    fontSize: '14px'
                  }}>
                    {item.Lote?.numero_lote || '—'}
                  </td>

                  <td style={{
                    padding: '17px 18px',
                    color: '#806871',
                    fontSize: '14px'
                  }}>
                    {item.Lote?.fecha_vencimiento || '—'}
                  </td>

                  <td style={{
                    padding: '17px 18px',
                    color: esBajo ? '#bd5968' : '#513b42',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {item.cantidad_actual}
                  </td>

                  <td style={{
                    padding: '17px 18px',
                    color: '#806871',
                    fontSize: '14px'
                  }}>
                    {item.Producto?.stock_minimo ?? '—'}
                  </td>

                  <td style={{
                    padding: '17px 18px'
                  }}>
                    {esBajo ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '7px 11px',
                        borderRadius: '20px',
                        backgroundColor: '#fff0f1',
                        color: '#c45f70',
                        border: '1px solid #f2d1d6',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        ⚠ Stock bajo (total)
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '7px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#f0faf4',
                        color: '#4c9a6a',
                        border: '1px solid #d6edde',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        ✓ OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtrado.length === 0 && (
        <p style={{
          marginTop: '18px',
          padding: '20px',
          textAlign: 'center',
          color: '#a5828b',
          fontSize: '14px',
          backgroundColor: '#fff',
          borderRadius: '14px',
          border: '1px solid #f1dfe4'
        }}>
          No se encontraron resultados.
        </p>
      )}
    </div>
  );
}

export default Inventario;
