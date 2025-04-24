import React from "react";
import "./App.css";
import { Body } from "./Components/Body/Body";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Body />
    </>
  );
}

export default App;
