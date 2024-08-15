// PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  // const Auth = useSelector((state) => state.AuthSlice);
  const isLogin = localStorage.getItem('isLogin');
  const location = useLocation();

  // Redirect to login if the user is not logged in
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the outlet if the user is logged in
  return <Outlet />;
};

export default PrivateRoute;
