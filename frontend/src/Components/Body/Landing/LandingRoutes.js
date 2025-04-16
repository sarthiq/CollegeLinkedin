<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingHome } from './LandingHome/LandingHome';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
=======
import { Routes, Route } from "react-router-dom";
import { Landing } from "./LandingHome/Landing";
import { Blogs } from "./Blogs/Blogs";
import { PageNotFound } from "../../UI/PageNotFound/PageNotFound";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { AuthRoutes } from "./Auth/AuthRoutes";
>>>>>>> baaf9f90c42a9a6de275e46fe3a7f40b5bf80a88

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
