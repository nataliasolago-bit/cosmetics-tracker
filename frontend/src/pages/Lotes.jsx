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

  function esLoteVencido(fechaVencimiento) {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(fechaVencimiento) < hoy;
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

  if (cargando) return <p>Cargando lotes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Lotes</h1>
        <button onClick={abrirNuevo} style={{ padding: '8px 16px' }}>+ Nuevo lote</button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
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
          <h3 style={{ gridColumn: '1 / -1' }}>{editandoId ? 'Editar lote' : 'Nuevo lote'}</h3>

          <div>
            <label>Producto</label><br />
            <select
              name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              required
              disabled={!!editandoId}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Selecciona...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Número de lote</label><br />
            <input name="numero_lote" value={form.numero_lote} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label>Fecha de fabricación</label><br />
            <input type="date" name="fecha_fabricacion" value={form.fecha_fabricacion} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label>Fecha de vencimiento</label><br />
            <input type="date" name="fecha_vencimiento" value={form.fecha_vencimiento} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>

          <div>
            <label>Cantidad inicial</label><br />
            <input
              name="cantidad_inicial"
              type="number"
              value={form.cantidad_inicial}
              onChange={handleChange}
              required
              disabled={!!editandoId}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ padding: '8px 16px' }}>
              {editandoId ? 'Guardar cambios' : 'Crear lote'}
            </button>
            <button type="button" onClick={cerrarForm} style={{ padding: '8px 16px' }}>Cancelar</button>
          </div>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Producto</th>
            <th style={{ padding: '10px' }}>N° de lote</th>
            <th style={{ padding: '10px' }}>Fabricación</th>
            <th style={{ padding: '10px' }}>Vencimiento</th>
            <th style={{ padding: '10px' }}>Cant. inicial</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((l) => {
            const vencido = esLoteVencido(l.fecha_vencimiento);
            return (
              <tr
                key={l.id}
                style={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: vencido ? '#fee2e2' : 'transparent',
                }}
              >
                <td style={{ padding: '10px' }}>{l.Producto?.nombre || '—'}</td>
                <td style={{ padding: '10px' }}>{l.numero_lote}</td>
                <td style={{ padding: '10px' }}>{l.fecha_fabricacion}</td>
                <td style={{ padding: '10px' }}>{l.fecha_vencimiento}</td>
                <td style={{ padding: '10px' }}>{l.cantidad_inicial}</td>
                <td style={{ padding: '10px' }}>
                  {vencido ? (
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>⚠ Vencido</span>
                  ) : (
                    <span style={{ color: '#16a34a' }}>Vigente</span>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => abrirEditar(l)} style={{ marginRight: '8px' }}>Editar</button>
                  {esAdmin && <button onClick={() => handleEliminar(l.id)} style={{ color: 'red' }}>Eliminar</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {lotes.length === 0 && <p style={{ marginTop: '12px' }}>No hay lotes registrados.</p>}
    </div>
  );
}

export default Lotes;