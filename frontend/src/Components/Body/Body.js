import { Admin } from "./Admin/Admin";
import { UserRoutes } from "./User/UserRoutes";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LandingRoutes } from "./Landing/LandingRoutes";
import { InfoRoutes } from "./Info/InfoRoutes";
import { ProtectedRoute } from "../UI/Routes/RoutesUtils";


export const Body = () => {
  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  return (
    <Routes>
      <Route path="admin/*" element={<Admin />} />
      <Route path="info/*" element={<InfoRoutes />} />

      {/* Protected Routes - Only accessible when logged in */}
      <Route
        path="dashboard/*"
        element={
         // <ProtectedRoute isLoggedIn={isLoggedIn}>
            <UserRoutes />
         // </ProtectedRoute>
        }
      />

      {/* Public Routes - Only accessible when not logged in */}
      <Route path="landing/*" element={<LandingRoutes />} />

      {/* Default route based on auth status */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};
