import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.user);

  if (loading) return <Loading />;

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;