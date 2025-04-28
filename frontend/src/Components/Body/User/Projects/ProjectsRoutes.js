import { ProjectDetails } from "./ProjectDetails/ProjectDetails";
  import { ProjectsHome } from "./ProjectsHome/ProjectsHome";
import { PageNotFound } from "../../../UI/PageNotFound/PageNotFound";
import { Routes, Route } from "react-router-dom";

export const ProjectsRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="" element={<ProjectsHome />} />
        <Route path="id/:id" element={<ProjectDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
