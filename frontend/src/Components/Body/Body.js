import { Landing } from "./Landing/Landing";
import { Admin } from "./Admin/Admin";
import { User } from "./User/User";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

export const Body = () => {
  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/*" element={isLoggedIn ? <User /> : <Landing />} />
    </Routes>
  );
};
