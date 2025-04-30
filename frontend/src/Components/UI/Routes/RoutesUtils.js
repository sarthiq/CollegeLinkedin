
import { useLocation, Navigate } from "react-router-dom";


export const ProtectedRoute = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // If not logged in, redirect to landing with the attempted path
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicRoute = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (isLoggedIn) {
    // If logged in, redirect to dashboard
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};
