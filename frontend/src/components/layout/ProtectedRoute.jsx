import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to a safe page like home or unauthorized
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
