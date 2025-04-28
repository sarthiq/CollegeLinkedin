import { PageNotFound } from "../../../UI/PageNotFound/PageNotFound";   
import { Profile } from "./ProfileHome/Profile";
import { EditProfile } from "./EditProfile/EditProfile";
import { Routes, Route } from "react-router-dom";

export const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Profile />} />
      <Route path="edit" element={<EditProfile />} />
      <Route path="*" element={<PageNotFound isAdmin={false} />} />
    </Routes>
  );
};
