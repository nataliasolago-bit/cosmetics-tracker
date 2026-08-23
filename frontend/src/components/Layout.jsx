import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#fff9fa',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          background: 'linear-gradient(180deg, #6f4351 0%, #56343f 100%)',
          color: '#fff',
          padding: '28px 18px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(91, 52, 63, 0.12)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Logo / Marca */}
        <div
          style={{
            padding: '4px 10px 26px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f4d8df, #d99baa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6f4351',
              fontSize: '20px',
              marginBottom: '12px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            }}
          >
            ✦
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '-0.3px',
            }}
          >
            Cosmetics Tracker
          </h2>

          <p
            style={{
              marginTop: '5px',
              fontSize: '12px',
              color: '#e9cbd2',
              letterSpacing: '0.4px',
            }}
          >
            Gestión de cosméticos
          </p>
        </div>

        {/* Navegación */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1,
          }}
        >
          <Link
            to="/dashboard"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            ♡ &nbsp; Dashboard
          </Link>

          <Link
            to="/productos"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Productos
          </Link>

          <Link
            to="/categorias"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Categorías
          </Link>

          <Link
            to="/marcas"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Marcas
          </Link>

          <Link
            to="/proveedores"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Proveedores
          </Link>

          <Link
            to="/lotes"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Lotes
          </Link>

          <Link
            to="/inventario"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Inventario
          </Link>

          <Link
            to="/movimientos"
            style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '11px 13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ♡ &nbsp; Movimientos
          </Link>
        </nav>

        {/* Usuario */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            paddingTop: '18px',
            marginTop: '18px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '13px',
              marginBottom: '10px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              {usuario?.nombre}
            </p>

            <p
              style={{
                fontSize: '11px',
                color: '#e9cbd2',
                textTransform: 'capitalize',
              }}
            >
              {usuario?.rol}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido de cada pantalla */}
      <main
        style={{
          flex: 1,
          padding: '36px',
          minWidth: 0,
          background:
            'radial-gradient(circle at top right, rgba(242, 205, 214, 0.22), transparent 28%), #fff9fa',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
