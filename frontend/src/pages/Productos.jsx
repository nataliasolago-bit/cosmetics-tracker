import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVacio());

  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';

  function formVacio() {
    return {
      nombre: '',
      descripcion: '',
      categoria_id: '',
      marca_id: '',
      proveedor_id: '',
      precio: '',
      stock_minimo: '',
    };
  }

  async function cargarTodo() {
    setCargando(true);
    setError('');
    try {
      const [resProductos, resCategorias, resMarcas, resProveedores] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
        api.get('/marcas'),
        api.get('/proveedores'),
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
      setMarcas(resMarcas.data);
      setProveedores(resProveedores.data);
    } catch (err) {
      setError('No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function abrirFormNuevo() {
    setForm(formVacio());
    setEditandoId(null);
    setMostrarForm(true);
  }

  function abrirFormEditar(producto) {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id,
      marca_id: producto.marca_id,
      proveedor_id: producto.proveedor_id,
      precio: producto.precio,
      stock_minimo: producto.stock_minimo,
    });
    setEditandoId(producto.id);
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
        await api.put(`/productos/${editandoId}`, form);
      } else {
        await api.post('/productos', form);
      }
      cerrarForm();
      cargarTodo();
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al guardar el producto';
      alert(mensaje);
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      await api.delete(`/productos/${id}`);
      cargarTodo();
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al eliminar el producto';
      alert(mensaje);
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
      Cargando productos...
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
            Productos
          </h1>

          <p style={{
            margin: '7px 0 0',
            color: '#a5828b',
            fontSize: '14px'
          }}>
            Gestiona tu catálogo de productos cosméticos
          </p>
        </div>

        <button
          onClick={abrirFormNuevo}
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
          + Nuevo producto
        </button>
      </div>

      {mostrarForm && (
        <FormularioProducto
          form={form}
          categorias={categorias}
          marcas={marcas}
          proveedores={proveedores}
          editando={!!editandoId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelar={cerrarForm}
        />
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
              <th style={celdaCabecera}>Nombre</th>
              <th style={celdaCabecera}>Categoría</th>
              <th style={celdaCabecera}>Marca</th>
              <th style={celdaCabecera}>Proveedor</th>
              <th style={celdaCabecera}>Precio</th>
              <th style={celdaCabecera}>Stock mínimo</th>
              <th style={celdaCabecera}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid #f3e8eb'
                }}
              >
                <td style={{
                  ...celdaEstilo,
                  color: '#513b42',
                  fontWeight: '600'
                }}>
                  {p.nombre}
                </td>

                <td style={celdaEstilo}>
                  {p.Categorium?.nombre || p.Categoria?.nombre || '—'}
                </td>

                <td style={celdaEstilo}>
                  {p.Marca?.nombre || '—'}
                </td>

                <td style={celdaEstilo}>
                  {p.Proveedor?.nombre || '—'}
                </td>

                <td style={{
                  ...celdaEstilo,
                  color: '#9f5d6d',
                  fontWeight: '700'
                }}>
                  ${Number(p.precio).toLocaleString()}
                </td>

                <td style={{
                  ...celdaEstilo,
                  color: '#513b42',
                  fontWeight: '600'
                }}>
                  {p.stock_minimo}
                </td>

                <td style={celdaEstilo}>
                  <button
                    onClick={() => abrirFormEditar(p)}
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
                      onClick={() => handleEliminar(p.id)}
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

      {productos.length === 0 && (
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
          No hay productos registrados.
        </p>
      )}
    </div>
  );
}

function FormularioProducto({
  form,
  categorias,
  marcas,
  proveedores,
  editando,
  onChange,
  onSubmit,
  onCancelar
}) {
  return (
    <form
      onSubmit={onSubmit}
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
        {editando ? 'Editar producto' : 'Nuevo producto'}
      </h3>

      <div>
        <label style={labelEstilo}>Nombre</label>

        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          required
          style={inputEstilo}
        />
      </div>

      <div>
        <label style={labelEstilo}>Precio</label>

        <input
          name="precio"
          type="number"
          step="0.01"
          value={form.precio}
          onChange={onChange}
          required
          style={inputEstilo}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelEstilo}>Descripción</label>

        <input
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          style={inputEstilo}
        />
      </div>

      <div>
        <label style={labelEstilo}>Categoría</label>

        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={onChange}
          required
          style={inputEstilo}
        >
          <option value="">Selecciona...</option>

          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelEstilo}>Marca</label>

        <select
          name="marca_id"
          value={form.marca_id}
          onChange={onChange}
          required
          style={inputEstilo}
        >
          <option value="">Selecciona...</option>

          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelEstilo}>Proveedor</label>

        <select
          name="proveedor_id"
          value={form.proveedor_id}
          onChange={onChange}
          required
          style={inputEstilo}
        >
          <option value="">Selecciona...</option>

          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelEstilo}>Stock mínimo</label>

        <input
          name="stock_minimo"
          type="number"
          value={form.stock_minimo}
          onChange={onChange}
          required
          style={inputEstilo}
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
          {editando ? 'Guardar cambios' : 'Crear producto'}
        </button>

        <button
          type="button"
          onClick={onCancelar}
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
  );
}

const celdaCabecera = {
  padding: '16px 18px',
  color: '#73545d',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.7px',
  fontWeight: '700'
};

const celdaEstilo = {
  padding: '17px 18px',
  color: '#806871',
  fontSize: '14px'
};

const labelEstilo = {
  display: 'block',
  marginBottom: '7px',
  color: '#725861',
  fontSize: '13px',
  fontWeight: '600'
};

const inputEstilo = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  border: '1px solid #ead5da',
  borderRadius: '10px',
  outline: 'none',
  backgroundColor: '#fffafb',
  color: '#4a353b',
  fontSize: '14px'
};

export default Productos;