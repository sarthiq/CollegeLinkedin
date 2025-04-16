import { Routes, Route } from "react-router-dom";
import { JoinNow } from "./JoinNow/JoinNow";
import { SignIn } from "./SignIn/SignIn";
import { PageNotFound } from "../../../UI/PageNotFound/PageNotFound";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="joinNow" element={<JoinNow />} />
      <Route path="signIn" element={<SignIn />} />
      <Route path="*" element={<PageNotFound isAdmin={false} />} />
    </Routes>
  );
};
