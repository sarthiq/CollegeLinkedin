import React from "react";
import "./Home.css";
import {
  FaUsers,
  FaClipboardCheck,
  FaBrain,
  FaUserFriends,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";

export const Home = () => {
  // Mock data - Replace with actual data from youexr backend
  const stats = {
    totalUsers: 1250,
    todayTests: 45,
    iqTests: 380,
    personalityTests: 420,
    totalInstitutes: 150,
    activeUsers: 850,
    newUsers: 25,
    totalTests: 800,
  };

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Completed IQ Test",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Started Personality Test",
      time: "5 minutes ago",
      status: "in-progress",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Registered new account",
      time: "10 minutes ago",
      status: "new",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Completed Personality Test",
      time: "15 minutes ago",
      status: "completed",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="date-range">
          <FaCalendarAlt />
          <span>Last 30 Days</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClipboardCheck />
          </div>
          <div className="stat-content">
            <h3>Today's Tests</h3>
            <p className="stat-number">{stats.todayTests}</p>
            <span className="stat-change positive">+5% from yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBrain />
          </div>
          <div className="stat-content">
            <h3>IQ Tests Taken</h3>
            <p className="stat-number">{stats.iqTests}</p>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUserFriends />
          </div>
          <div className="stat-content">
            <h3>Personality Tests</h3>
            <p className="stat-number">{stats.personalityTests}</p>
            <span className="stat-change positive">+15% from last month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card">
          <h2>Test Analytics</h2>
          <div className="chart-container">
            {/* Add your chart component here */}
            <div className="chart-placeholder">
              <FaChartLine />
              <p>Test Analytics Chart</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <FaUserGraduate />
                </div>
                <div className="activity-content">
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <div className="activity-time">
                  <span className={`activity-status ${activity.status}`}>
                    {activity.status}
                  </span>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card notifications">
          <h2>Notifications</h2>
          <div className="notification-list">
            <div className="notification-item">
              <FaBell />
              <div className="notification-content">
                <p>New user registration spike detected</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <FaBell />
              <div className="notification-content">
                <p>System maintenance scheduled</p>
                <span>5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
