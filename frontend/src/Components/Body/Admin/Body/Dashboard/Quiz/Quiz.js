import { Navigate, Route, Routes } from "react-router-dom";
import { QuizHome } from "./Home/Home";
import { Question } from "./Question/Question";

export const Quiz = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<QuizHome/>}/>
        <Route path=":id/*" element={<Question />} />
        {/* Catch-all for invalid routes, redirecting to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
