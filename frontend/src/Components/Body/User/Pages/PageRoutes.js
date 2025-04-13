import { Routes, Route } from "react-router-dom";
import { PageHome } from "./PageHome/PageHome";
import { PageDetails } from "./PageDetails/PageDetails";
import { PageNotFound } from "../../../UI/PageNotFound/PageNotFound";

export const PagesRoutes   = () => {
  return (
    <Routes>
      <Route path="" element={<PageHome />} />
      <Route path="details/:id" element={<PageDetails />} />
      <Route path="*" element={<PageNotFound isAdmin={false} />} />
    </Routes>
  );
};
