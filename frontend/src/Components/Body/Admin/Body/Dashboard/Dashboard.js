import "bootstrap-icons/font/bootstrap-icons.css";
import { Navigate, Route, Routes, NavLink } from "react-router-dom";
import "./Dashboard.css";
import { useState } from "react";
import { Home } from "./Home/Home";

import { UserRoutes } from "./Users/UserRoutes";
import { PageNotFound } from "./PageNotFound/PageNotFound";
export const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="dashboard-admin-page">
      <div className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
        <ul className="dashboard-tabs-list">
          <li>
            <NavLink
              to="./"
              className={({ isActive }) =>
                isActive ? "dashboard-tab-link dashboard-active-tab" : "dashboard-tab-link"
              }
            >
              <i className="dashboard-tab-icon bi bi-speedometer2"></i>
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          
          <li 
            className="dashboard-dropdown"
            onMouseEnter={() => !collapsed && setUsersDropdownOpen(true)}
            onMouseLeave={() => setUsersDropdownOpen(false)}
          >
            <div className="dashboard-tab-link">
              <i className="dashboard-tab-icon bi bi-people"></i>
              {!collapsed && (
                <>
                  <span>Users</span>
                  <i className={`bi ${usersDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'} dashboard-dropdown-icon`}></i>
                </>
              )}
            </div>
            {!collapsed && usersDropdownOpen && (
              <ul className="dashboard-dropdown-menu">
                <li>
                  <NavLink
                    to="./users"
                    className={({ isActive }) =>
                      isActive ? "dashboard-dropdown-link dashboard-active-tab" : "dashboard-dropdown-link"
                    }
                  >
                    <i className="bi bi-list-ul"></i>
                    <span>Users List</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="./users/active-users"
                    className={({ isActive }) =>
                      isActive ? "dashboard-dropdown-link dashboard-active-tab" : "dashboard-dropdown-link"
                    }
                  >
                    <i className="bi bi-activity"></i>
                    <span>Active Users</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <button className="dashboard-toggle-button" onClick={toggleSidebar}>
          {collapsed ? "❯" : "❮"}
        </button>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="users/*" element={<UserRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
};




