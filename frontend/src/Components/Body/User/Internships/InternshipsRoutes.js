import { Routes, Route } from "react-router-dom";
import { InternshipHome } from "./InternshipHome/InternshipHome";
import { InternshipDetails } from "./InternshipDetails/InternshipDetails";
import { PageNotFound } from "../../../UI/PageNotFound/PageNotFound";


export const InternshipsRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<InternshipHome />} />
        <Route path="id/:id" element={<InternshipDetails />} />
        <Route path="*" element={<PageNotFound isAdmin={false} />} />
      </Routes>
    </div>
  );
};