import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await api.post('/auth/login', { email, password });
      const { token, usuario } = respuesta.data;

      login(token, usuario);
      navigate('/dashboard');
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al iniciar sesión';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #fff9fa 0%, #f8e8ec 50%, #fdf3f5 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '42px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #f1dfe4',
        boxShadow: '0 18px 50px rgba(120, 76, 88, 0.12)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '58px',
            height: '58px',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #d88c9a, #c87587)',
            color: '#ffffff',
            fontSize: '25px',
            boxShadow: '0 8px 20px rgba(200, 117, 135, 0.25)'
          }}>
            ✦
          </div>

          <h1 style={{
            margin: 0,
            color: '#593f47',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Bienvenida
          </h1>

          <p style={{
            margin: '9px 0 0',
            color: '#a5828b',
            fontSize: '14px'
          }}>
            Ingresa para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 15px',
                border: '1px solid #ead5da',
                borderRadius: '11px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#725861',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 15px',
                border: '1px solid #ead5da',
                borderRadius: '11px',
                outline: 'none',
                backgroundColor: '#fffafb',
                color: '#4a353b',
                fontSize: '14px'
              }}
            />
          </div>

          {error && (
            <p style={{
              margin: '0 0 18px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#fff1f2',
              border: '1px solid #f1d0d5',
              color: '#b94d5c',
              fontSize: '13px'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '13px 18px',
              border: 'none',
              borderRadius: '11px',
              background: cargando
                ? '#d9a7b0'
                : 'linear-gradient(135deg, #d88c9a, #c87587)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: cargando ? 'default' : 'pointer',
              boxShadow: '0 7px 18px rgba(200, 117, 135, 0.24)'
            }}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
