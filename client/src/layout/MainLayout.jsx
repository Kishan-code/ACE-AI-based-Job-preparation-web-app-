import React from "react";
import Navbar from "../components/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";

const MainLayout = () => {
  // const { isAuthenticated, loading } = useSelector(state => state.user);

  // if (loading) return <Loading />;
  // if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
