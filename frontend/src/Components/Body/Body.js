import { Landing } from "./Landing/Landing";
import { Admin } from "./Admin/Admin";
import { UserRoutes } from "./User/UserRoutes";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

export const Body = () => {
  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/*" element={isLoggedIn ? <UserRoutes /> : <Landing />} />
    </Routes>
  );
};
