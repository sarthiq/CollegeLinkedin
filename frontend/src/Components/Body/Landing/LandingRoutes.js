import { Routes, Route } from "react-router-dom";
import { Landing } from "./LandingHome/Landing";
import { Blogs } from "./Blogs/Blogs";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";
import { Header } from "./Header/Header";
import { Footer } from "../Footer/Footer";
import { AuthRoutes } from "./Auth/AuthRoutes";

export const LandingRoutes = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="*" element={<PageNotFound isAdmin={false} />} />
      </Routes>
      <Footer />
    </div>
  );
};
