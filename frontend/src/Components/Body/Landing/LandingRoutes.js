import { Routes, Route } from "react-router-dom";
import { LandingHome } from "./LandingHome/LandingHome";
import { Blogs } from "./Blogs/Blogs";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { AuthRoutes } from "./Auth/AuthRoutes";

export const LandingRoutes = () => {
    return (
        <div className="landing-container">
            <Header />
            <Routes>
                <Route path="/" element={<LandingHome />} />
                <Route path="/blogs/*" element={<div>Blogs Coming Soon</div>} />
                <Route path="/auth/*" element={<div>Auth Component Coming Soon</div>} />
            </Routes>
            <Footer />
        </div>
    );
};
