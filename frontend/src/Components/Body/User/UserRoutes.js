import { Routes, Route } from "react-router-dom";
import { Home } from "./Home/Home";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { PagesRoutes } from "./Pages/PageRoutes";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";
import { FeedDetails } from "./Common/FeedDetails/FeedDetails";
import { ProfileRoutes } from "./Profile/ProfileRoutes";
import { InternshipsRoutes } from "./Internships/InternshipsRoutes";
import { ProjectsRoutes } from "./Projects/ProjectsRoutes";
export const UserRoutes = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="profile/*" element={<ProfileRoutes />} />
          <Route path="internships/*" element={<InternshipsRoutes />} />
          <Route path="projects/*" element={<ProjectsRoutes />} />
          <Route path="pages/*" element={<PagesRoutes />} />
          <Route path="feed/:id" element={<FeedDetails />} />
          <Route path="*" element={<PageNotFound isAdmin={false} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};



