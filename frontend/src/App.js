import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Components/Body/User/Home/Home';
import Landing from './Components/Landing/Landing';
import Profile from './Components/Body/User/Profile/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/home" /> : <Landing onLogin={handleLogin} />
        } />
        <Route path="/home" element={
          isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/profile" element={
          isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />
        } />
      </Routes>
    </div>
  );
}

export default App;
