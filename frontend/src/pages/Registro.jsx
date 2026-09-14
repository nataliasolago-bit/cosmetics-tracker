import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await api.post('/auth/registro', { nombre, email, password });
      setExito(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al registrar el usuario';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px' }}>
      <h1>Crear cuenta</h1>

      {exito ? (
        <p style={{ color: 'green' }}>¡Cuenta creada con éxito! Redirigiendo al login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Nombre</label><br />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Email</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Contraseña</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Confirmar contraseña</label><br />
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={cargando} style={{ padding: '8px 16px' }}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '16px' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Registro;