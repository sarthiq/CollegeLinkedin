import React, { useState } from 'react';
import './App.css';
import Home from './Components/Body/User/Home/Home';
import Landing from './Components/Landing/Landing';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Home onLogout={handleLogout} />
      ) : (
        <Landing onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
