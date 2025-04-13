import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access adminAuth state

import { DashboardPage } from "./Dashboard/Dashboard";
import { AdminLoginPage } from "./Login/Login";

export const Body = () => {
  const isLoggedIn = useSelector((state) => state.adminAuth.isLoggedIn); // Access adminAuth state

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="login"
        element={
          isLoggedIn ? (
            <Navigate to="/admin/" replace /> // Redirect logged-in admins to dashboard
          ) : (
            <AdminLoginPage />
          )
        }
      />

      {/* Protected Dashboard Route */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <DashboardPage />
          ) : (
            <Navigate to="/admin/login" replace /> // Redirect to login if not logged in
          )
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/admin/" replace />} />
    </Routes>
  );
};
