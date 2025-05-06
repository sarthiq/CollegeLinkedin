import { Route, Routes } from "react-router-dom";
import { ActiveUsersHome } from "./ActiveUsersHome/ActiveUsersHome";
import { PageNotFound } from "../../PageNotFound/PageNotFound";
import { UserDetails } from "./UserDetails/UserDetails";


export const ActiveUsersRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<ActiveUsersHome />} />
      <Route path="id/:id" element={<UserDetails />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

