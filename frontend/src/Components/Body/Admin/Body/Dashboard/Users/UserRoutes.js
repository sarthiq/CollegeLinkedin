import { Route, Routes } from "react-router-dom";
import { UsersHome } from "./UsersHome/UsersHome";
import { UsersDetails } from "./UsersDetails/UsersDetails";
import { PageNotFound } from "../PageNotFound/PageNotFound";
import { ActiveUsersRoutes } from "./ActiveUsers/ActiveUsersRoutes";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<UsersHome />} />
      <Route path="id/:id" element={<UsersDetails />} />
      <Route path="active-users/*" element={<ActiveUsersRoutes />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
