import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NUEVO_LOTE = '__nuevo__';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio());

  const { usuario } = useAuth();

  function formVacio() {
    return {
      producto_id: '',
      lote_id: '',
      tipo: 'entrada',
      cantidad: '',
      motivo: '',
      numero_lote_nuevo: '',
      fecha_fabricacion_nueva: '',
      fecha_vencimiento_nueva: '',
    };
  }

  async function cargarTodo() {
    setCargando(true);
    setError('');
    try {
      const [resMovimientos, resProductos, resLotes] = await Promise.all([
        api.get('/movimientos'),
        api.get('/productos'),
        api.get('/lotes'),
      ]);
      setMovimientos(resMovimientos.data);
      setProductos(resProductos.data);
      setLotes(resLotes.data);
    } catch (err) {
      setError('No se pudieron cargar los movimientos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarTodo(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'producto_id' ? { lote_id: '' } : {}),
    }));
  }

  function abrirForm() {
    setForm(formVacio());
    setMostrarForm(true);
  }

  function cerrarForm() {
    setMostrarForm(false);
    setForm(formVacio());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (form.lote_id === NUEVO_LOTE) {
        // Crear el lote ya genera automáticamente su movimiento de entrada en el backend
        await api.post('/lotes', {
          producto_id: form.producto_id,
          numero_lote: form.numero_lote_nuevo,
          fecha_fabricacion: form.fecha_fabricacion_nueva,
          fecha_vencimiento: form.fecha_vencimiento_nueva,
          cantidad_inicial: Number(form.cantidad),
        });
      } else {
        // Lote existente: sí se registra el movimiento manualmente
        await api.post('/movimientos', {
          producto_id: form.producto_id,
          lote_id: form.lote_id,
          tipo: form.tipo,
          cantidad: Number(form.cantidad),
          motivo: form.motivo,
          usuario_id: usuario.id,
        });
      }

      cerrarForm();
      cargarTodo();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar el movimiento');
    }
  }

  if (cargando) return (
    <p style={{
      padding: '40px',
      textAlign: 'center',
      color: '#9b7b83',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif'
    }}>
      Cargando movimientos...
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

  const lotesFiltrados = lotes.filter((l) => String(l.producto_id) === String(form.producto_id));
  const esLoteNuevo = form.lote_id === NUEVO_LOTE;

  return (
    <div style={{
      minHeight: '100%',
      padding: '32px',
      background: 'linear-gradient(135deg, #fff9fa 0%, #fdf3f5 100%)',
      fontFamily: 'Arial, sans-serif',
      color: '#4a353b'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f0dfe3'
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: '700',
            color: '#593f47',
            letterSpacing: '-0.5px'
          }}>
            Movimientos
          </h1>

          <p style={{
            margin: '7px 0 0',
            color: '#a5828b',
            fontSize: '14px'
          }}>
            Registra y consulta las entradas y salidas del inventario
          </p>
        </div>

        <button
          onClick={abrirForm}
          style={{
            padding: '11px 20px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d88c9a, #c87587)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 5px 14px rgba(200, 117, 135, 0.25)'
          }}
        >
          + Registrar movimiento
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            padding: '26px',
            borderRadius: '18px',
            marginBottom: '26px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            border: '1px solid #f1dfe4',
            boxShadow: '0 8px 25px rgba(120, 76, 88, 0.08)'
          }}
        >
          <h3 style={{
            gridColumn: '1 / -1',
            margin: '0 0 2px',
            color: '#593f47',
            fontSize: '20px'
          }}>
            Nuevo movimiento
          </h3>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Producto
            </label>

            <select
              name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            >
              <option value="">Selecciona...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Lote
            </label>

            <select
              name="lote_id"
              value={form.lote_id}
              onChange={handleChange}
              required
              disabled={!form.producto_id}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: !form.producto_id ? '#f8f3f4' : '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            >
              <option value="">
                {form.producto_id ? 'Selecciona...' : 'Elige un producto primero'}
              </option>

              {lotesFiltrados.map((l) => (
                <option key={l.id} value={l.id}>{l.numero_lote}</option>
              ))}

              {form.tipo === 'entrada' && form.producto_id && (
                <option value={NUEVO_LOTE}>+ Nuevo lote...</option>
              )}
            </select>
          </div>

          {esLoteNuevo && (
            <>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#725861',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Número de lote
                </label>

                <input
                  name="numero_lote_nuevo"
                  value={form.numero_lote_nuevo}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    border: '1px solid #ead5da',
                    borderRadius: '10px',
                    outline: 'none',
                    backgroundColor: '#fffafb',
                    color: '#4a353b',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#725861',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Fecha de fabricación
                </label>

                <input
                  type="date"
                  name="fecha_fabricacion_nueva"
                  value={form.fecha_fabricacion_nueva}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    border: '1px solid #ead5da',
                    borderRadius: '10px',
                    outline: 'none',
                    backgroundColor: '#fffafb',
                    color: '#4a353b',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#725861',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Fecha de vencimiento
                </label>

                <input
                  type="date"
                  name="fecha_vencimiento_nueva"
                  value={form.fecha_vencimiento_nueva}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    border: '1px solid #ead5da',
                    borderRadius: '10px',
                    outline: 'none',
                    backgroundColor: '#fffafb',
                    color: '#4a353b',
                    fontSize: '14px'
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Tipo
            </label>

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Cantidad
            </label>

            <input
              name="cantidad"
              type="number"
              min="1"
              value={form.cantidad}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Motivo (opcional)
            </label>

            <input
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            gap: '9px',
            paddingTop: '2px'
          }}>
            <button
              type="submit"
              style={{
                padding: '11px 19px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#c87587',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Registrar
            </button>

            <button
              type="button"
              onClick={cerrarForm}
              style={{
                padding: '11px 19px',
                border: '1px solid #e3cbd1',
                borderRadius: '10px',
                backgroundColor: '#fff',
                color: '#795d65',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div style={{
        backgroundColor: '#fff',
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
              <th style={estiloTh}>Fecha</th>
              <th style={estiloTh}>Producto</th>
              <th style={estiloTh}>Lote</th>
              <th style={estiloTh}>Tipo</th>
              <th style={estiloTh}>Cantidad</th>
              <th style={estiloTh}>Motivo</th>
              <th style={estiloTh}>Usuario</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.map((m) => (
              <tr
                key={m.id}
                style={{
                  borderBottom: '1px solid #f3e8eb'
                }}
              >
                <td style={estiloTd}>
                  {new Date(m.fecha).toLocaleString()}
                </td>

                <td style={{
                  ...estiloTd,
                  color: '#513b42',
                  fontWeight: '600'
                }}>
                  {m.Producto?.nombre || '—'}
                </td>

                <td style={estiloTd}>
                  {m.Lote?.numero_lote || '—'}
                </td>

                <td style={estiloTd}>
                  {m.tipo === 'entrada' ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '20px',
                      backgroundColor: '#edf9f1',
                      color: '#27834a',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      ↑ Entrada
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '20px',
                      backgroundColor: '#fff0f1',
                      color: '#c44f60',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      ↓ Salida
                    </span>
                  )}
                </td>

                <td style={{
                  ...estiloTd,
                  color: '#513b42',
                  fontWeight: '700'
                }}>
                  {m.cantidad}
                </td>

                <td style={estiloTd}>
                  {m.motivo || '—'}
                </td>

                <td style={estiloTd}>
                  {m.Usuario?.nombre || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {movimientos.length === 0 && (
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
          No hay movimientos registrados.
        </p>
      )}
    </div>
  );
}

const estiloTh = {
  padding: '16px 18px',
  color: '#73545d',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.7px',
  fontWeight: '700'
};

const estiloTd = {
  padding: '17px 18px',
  color: '#806871',
  fontSize: '14px'
};

export default Movimientos;
