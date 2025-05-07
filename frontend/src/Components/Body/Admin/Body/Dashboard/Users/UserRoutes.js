import { Route, Routes } from "react-router-dom";
import { UsersHome } from "./UsersHome/UsersHome";
import { UsersDetails } from "./UsersDetails/UsersDetails";
import { PageNotFound } from "../PageNotFound/PageNotFound";
import { ActiveUsersRoutes } from "./ActiveUsers/ActiveUsersRoutes";
import { JoinedUsers } from "./JoinedUsers/JoinedUsers";

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<UsersHome />} />
      <Route path="id/:id" element={<UsersDetails />} />
      <Route path="active-users/*" element={<ActiveUsersRoutes />} />
      <Route path="joined-users" element={<JoinedUsers />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
