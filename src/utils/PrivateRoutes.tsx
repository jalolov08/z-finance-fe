import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/useAuthStore";

export const PrivateRoutes = () => {
  const { user } = useAuthStore();

  return user.authenticated ? <Outlet /> : <Navigate to="login" />;
};
