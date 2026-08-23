import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });

  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';

  async function cargar() {
    setCargando(true);
    const res = await api.get('/categorias');
    setCategorias(res.data);
    setCargando(false);
  }

  useEffect(() => { cargar(); }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function abrirNuevo() {
    setForm({ nombre: '', descripcion: '' });
    setEditandoId(null);
    setMostrarForm(true);
  }

  function abrirEditar(c) {
    setForm({ nombre: c.nombre, descripcion: c.descripcion || '' });
    setEditandoId(c.id);
    setMostrarForm(true);
  }

  function cerrarForm() {
    setMostrarForm(false);
    setEditandoId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/categorias/${editandoId}`, form);
      } else {
        await api.post('/categorias', form);
      }
      cerrarForm();
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  if (cargando) return <p style={{
    padding: '40px',
    textAlign: 'center',
    color: '#9b7b83',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif'
  }}>Cargando categorías...</p>;

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
            Categorías
          </h1>
          <p style={{
            margin: '7px 0 0',
            color: '#a5828b',
            fontSize: '14px'
          }}>
            Organiza y administra las categorías de tus productos
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
            boxShadow: '0 5px 14px rgba(200, 117, 135, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          + Nueva categoría
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
            border: '1px solid #f1dfe4',
            boxShadow: '0 8px 25px rgba(120, 76, 88, 0.08)'
          }}
        >
          <h3 style={{
            margin: '0 0 22px',
            color: '#593f47',
            fontSize: '20px'
          }}>
            {editandoId ? 'Editar categoría' : 'Nueva categoría'}
          </h3>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Nombre
            </label>

            <input
              name="nombre"
              value={form.nombre}
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '7px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Descripción
            </label>

            <input
              name="descripcion"
              value={form.descripcion}
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

          <button
            type="submit"
            style={{
              padding: '11px 19px',
              marginRight: '9px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#c87587',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {editandoId ? 'Guardar cambios' : 'Crear'}
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
                padding: '16px 20px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                fontWeight: '700'
              }}>
                Nombre
              </th>

              <th style={{
                padding: '16px 20px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                fontWeight: '700'
              }}>
                Descripción
              </th>

              <th style={{
                padding: '16px 20px',
                color: '#73545d',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                fontWeight: '700'
              }}>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((c) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: '1px solid #f3e8eb',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <td style={{
                  padding: '17px 20px',
                  color: '#513b42',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {c.nombre}
                </td>

                <td style={{
                  padding: '17px 20px',
                  color: '#927982',
                  fontSize: '14px'
                }}>
                  {c.descripcion || '—'}
                </td>

                <td style={{
                  padding: '17px 20px'
                }}>
                  <button
                    onClick={() => abrirEditar(c)}
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
                      onClick={() => handleEliminar(c.id)}
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

      {categorias.length === 0 && (
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
          No hay categorías registradas.
        </p>
      )}
    </div>
  );
}

export default Categorias;
