import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // TODO: Implement actual authentication check
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
