import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingHome } from './LandingHome/LandingHome';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

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
