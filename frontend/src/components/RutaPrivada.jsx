import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaPrivada({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RutaPrivada;
