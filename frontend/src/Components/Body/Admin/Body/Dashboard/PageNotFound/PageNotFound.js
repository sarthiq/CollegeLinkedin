import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./PageNotFound.css";

export const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/admin" className="back-to-home">
        <FaHome className="me-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

