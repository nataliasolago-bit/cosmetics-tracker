import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVacio());

  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';

  function formVacio() {
    return {
      producto_id: '',
      numero_lote: '',
      fecha_fabricacion: '',
      fecha_vencimiento: '',
      cantidad_inicial: '',
    };
  }

  async function cargarTodo() {
    setCargando(true);
    setError('');
    try {
      const [resLotes, resProductos] = await Promise.all([
        api.get('/lotes'),
        api.get('/productos'),
      ]);
      setLotes(resLotes.data);
      setProductos(resProductos.data);
    } catch (err) {
      setError('No se pudieron cargar los lotes');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarTodo(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function abrirNuevo() {
    setForm(formVacio());
    setEditandoId(null);
    setMostrarForm(true);
  }

  function abrirEditar(lote) {
    setForm({
      producto_id: lote.producto_id,
      numero_lote: lote.numero_lote,
      fecha_fabricacion: lote.fecha_fabricacion?.slice(0, 10) || '',
      fecha_vencimiento: lote.fecha_vencimiento?.slice(0, 10) || '',
      cantidad_inicial: lote.cantidad_inicial,
    });
    setEditandoId(lote.id);
    setMostrarForm(true);
  }

  function cerrarForm() {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(formVacio());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        // Al editar no se manda producto_id ni cantidad_inicial (el backend solo actualiza datos del lote)
        const { numero_lote, fecha_fabricacion, fecha_vencimiento } = form;
        await api.put(`/lotes/${editandoId}`, { numero_lote, fecha_fabricacion, fecha_vencimiento });
      } else {
        await api.post('/lotes', form);
      }
      cerrarForm();
      cargarTodo();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar el lote');
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Seguro que quieres eliminar este lote?')) return;
    try {
      await api.delete(`/lotes/${id}`);
      cargarTodo();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el lote');
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
      Cargando lotes...
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
            Lotes
          </h1>

          <p style={{
            margin: '7px 0 0',
            color: '#a5828b',
            fontSize: '14px'
          }}>
            Gestiona los lotes y fechas de tus productos
          </p>
        </div>

        <button
          onClick={abrirNuevo}
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
          + Nuevo lote
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
            {editandoId ? 'Editar lote' : 'Nuevo lote'}
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
              disabled={!!editandoId}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: editandoId ? '#f8f3f4' : '#fffafb',
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
              Número de lote
            </label>

            <input
              name="numero_lote"
              value={form.numero_lote}
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
              name="fecha_fabricacion"
              value={form.fecha_fabricacion}
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
              name="fecha_vencimiento"
              value={form.fecha_vencimiento}
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
              Cantidad inicial
            </label>

            <input
              name="cantidad_inicial"
              type="number"
              value={form.cantidad_inicial}
              onChange={handleChange}
              required
              disabled={!!editandoId}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                border: '1px solid #ead5da',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: editandoId ? '#f8f3f4' : '#fffafb',
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
              {editandoId ? 'Guardar cambios' : 'Crear lote'}
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
                Fabricación
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
                Cant. inicial
              </th>

              <th style={{
                padding: '16px 18px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
                fontWeight: '700'
              }}>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {lotes.map((l) => (
              <tr
                key={l.id}
                style={{
                  borderBottom: '1px solid #f3e8eb'
                }}
              >
                <td style={{
                  padding: '17px 18px',
                  color: '#513b42',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {l.Producto?.nombre || '—'}
                </td>

                <td style={{
                  padding: '17px 18px',
                  color: '#806871',
                  fontSize: '14px'
                }}>
                  {l.numero_lote}
                </td>

                <td style={{
                  padding: '17px 18px',
                  color: '#806871',
                  fontSize: '14px'
                }}>
                  {l.fecha_fabricacion}
                </td>

                <td style={{
                  padding: '17px 18px',
                  color: '#806871',
                  fontSize: '14px'
                }}>
                  {l.fecha_vencimiento}
                </td>

                <td style={{
                  padding: '17px 18px',
                  color: '#513b42',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {l.cantidad_inicial}
                </td>

                <td style={{
                  padding: '17px 18px'
                }}>
                  <button
                    onClick={() => abrirEditar(l)}
                    style={{
                      marginRight: '8px',
                      padding: '8px 13px',
                      border: '1px solid #e3c6ce',
                      borderRadius: '8px',
                      backgroundColor: '#fff8fa',
                      color: '#a15e70',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>

                  {esAdmin && (
                    <button
                      onClick={() => handleEliminar(l.id)}
                      style={{
                        padding: '8px 13px',
                        border: '1px solid #f0d1d7',
                        borderRadius: '8px',
                        backgroundColor: '#fff7f8',
                        color: '#c45f70',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lotes.length === 0 && (
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
          No hay lotes registrados.
        </p>
      )}
    </div>
  );
}

export default Lotes;