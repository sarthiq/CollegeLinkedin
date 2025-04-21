import { Routes, Route } from "react-router-dom";
import { LandingHome } from "./LandingHome/LandingHome";
import { Blogs } from "./Blogs/Blogs";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { AuthRoutes } from "./Auth/AuthRoutes";
import { TermsOfService } from "./TermsOfService/TermsOfService";
import { PrivacyPolicy } from "./PrivacyPolicy/PrivacyPolicy";
import { RefundPolicy } from "./RefundPolicy/RefundPolicy";
export const LandingRoutes = () => {
    return (
        <div className="landing-container">
            <Header />
            <Routes>
        <Route path="" element={<LandingHome />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="refund" element={<RefundPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
    );
};
