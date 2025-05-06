import React, { useEffect } from "react";
import "./App.css";
import { Body } from "./Components/Body/Body";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socketService } from './services/socketService';
import { useSelector } from 'react-redux';

function App() {
  const token = useSelector(state => state.userAuth.token);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [token]);

  return (
    <>
      <ToastContainer />
      <Body />
    </>
  );
}

export default App;
