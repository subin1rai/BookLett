import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AuthenticatedRoute = () => {
  const { setShowSignIn } = useContext(AppContext);
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    setShowSignIn(true);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthenticatedRoute;
