import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [inventario, setInventario] = useState([]);
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

  function esLoteVencido(fechaVencimiento) {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(fechaVencimiento) < hoy;
  }

  function calcularStockPorProducto(productoId) {
    const filas = inventario.filter((item) => item.producto_id === productoId);
    let vigente = 0;
    let vencido = 0;

    filas.forEach((item) => {
      if (esLoteVencido(item.Lote?.fecha_vencimiento)) {
        vencido += item.cantidad_actual;
      } else {
        vigente += item.cantidad_actual;
      }
    });

    return { total: vigente + vencido, vigente, vencido };
  }

  async function cargarTodo() {
    setCargando(true);
    setError('');
    try {
      const [resProductos, resCategorias, resMarcas, resProveedores, resInventario] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
        api.get('/marcas'),
        api.get('/proveedores'),
        api.get('/inventario'),
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
      setMarcas(resMarcas.data);
      setProveedores(resProveedores.data);
      setInventario(resInventario.data);
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

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Productos</h1>
        <button onClick={abrirFormNuevo} style={{ padding: '8px 16px' }}>
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

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={celdaEstilo}>Nombre</th>
            <th style={celdaEstilo}>Categoría</th>
            <th style={celdaEstilo}>Marca</th>
            <th style={celdaEstilo}>Proveedor</th>
            <th style={celdaEstilo}>Precio</th>
            <th style={celdaEstilo}>Stock</th>
            <th style={celdaEstilo}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const stock = calcularStockPorProducto(p.id);
            const soloVencido = stock.total > 0 && stock.vigente === 0 && stock.vencido > 0;
            const parcialVencido = stock.vigente > 0 && stock.vencido > 0;

            return (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={celdaEstilo}>{p.nombre}</td>
                <td style={celdaEstilo}>{p.Categorium?.nombre || p.Categoria?.nombre || '—'}</td>
                <td style={celdaEstilo}>{p.Marca?.nombre || '—'}</td>
                <td style={celdaEstilo}>{p.Proveedor?.nombre || '—'}</td>
                <td style={celdaEstilo}>${Number(p.precio).toLocaleString()}</td>
                <td style={celdaEstilo}>
                  <div>{stock.total} unidades (mín: {p.stock_minimo})</div>
                  {soloVencido && (
                    <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '13px' }}>
                      ⚠ Hay {stock.total} unidades, pero todas están vencidas
                    </div>
                  )}
                  {parcialVencido && (
                    <div style={{ color: '#f59e0b', fontSize: '13px' }}>
                      ⚠ {stock.vencido} de {stock.total} unidades están vencidas
                    </div>
                  )}
                </td>
                <td style={celdaEstilo}>
                  <button onClick={() => abrirFormEditar(p)} style={{ marginRight: '8px' }}>
                    Editar
                  </button>
                  {esAdmin && (
                    <button onClick={() => handleEliminar(p.id)} style={{ color: 'red' }}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {productos.length === 0 && <p style={{ marginTop: '12px' }}>No hay productos registrados.</p>}
    </div>
  );
}

function FormularioProducto({ form, categorias, marcas, proveedores, editando, onChange, onSubmit, onCancelar }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
      }}
    >
      <h3 style={{ gridColumn: '1 / -1' }}>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>

      <div>
        <label>Nombre</label><br />
        <input name="nombre" value={form.nombre} onChange={onChange} required style={inputEstilo} />
      </div>

      <div>
        <label>Precio</label><br />
        <input name="precio" type="number" step="0.01" value={form.precio} onChange={onChange} required style={inputEstilo} />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label>Descripción</label><br />
        <input name="descripcion" value={form.descripcion} onChange={onChange} style={inputEstilo} />
      </div>

      <div>
        <label>Categoría</label><br />
        <select name="categoria_id" value={form.categoria_id} onChange={onChange} required style={inputEstilo}>
          <option value="">Selecciona...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Marca</label><br />
        <select name="marca_id" value={form.marca_id} onChange={onChange} required style={inputEstilo}>
          <option value="">Selecciona...</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Proveedor</label><br />
        <select name="proveedor_id" value={form.proveedor_id} onChange={onChange} required style={inputEstilo}>
          <option value="">Selecciona...</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Stock mínimo</label><br />
        <input name="stock_minimo" type="number" value={form.stock_minimo} onChange={onChange} required style={inputEstilo} />
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
        <button type="submit" style={{ padding: '8px 16px' }}>
          {editando ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" onClick={onCancelar} style={{ padding: '8px 16px' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

const celdaEstilo = { padding: '10px' };
const inputEstilo = { width: '100%', padding: '8px' };

export default Productos;