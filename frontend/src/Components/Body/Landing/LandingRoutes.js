import { Routes, Route } from "react-router-dom";
import { Landing } from "./LandingHome/Landing";
import { Blogs } from "./Blogs/Blogs";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Landing />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="*" element={<PageNotFound isAdmin={false} />} />
    </Routes>
  );
};
