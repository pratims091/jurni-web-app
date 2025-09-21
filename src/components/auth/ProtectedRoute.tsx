import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('travel_current_user') || 'null');
  const auth_token = localStorage.getItem('auth_token') || null;
  if (!user || !auth_token) {
    return null;
  }
  return user;
};

const ProtectedRoute = () => {
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/signup" />;
};

export default ProtectedRoute;
