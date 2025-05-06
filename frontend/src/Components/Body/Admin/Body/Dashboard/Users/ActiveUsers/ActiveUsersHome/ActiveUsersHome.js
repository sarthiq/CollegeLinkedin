import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getDailyActiveUsersHandler, getDailyActiveUsersStatsHandler } from '../../userApiHandler';
import './ActiveUsersHome.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ActiveUsersHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalActiveUsers: 0,
    date: ''
  });
  const [periodStats, setPeriodStats] = useState({
    period: { startDate: '', endDate: '', days: 30 },
    stats: []
  });
  const [selectedDays, setSelectedDays] = useState(30);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchActiveUsers();
    fetchPeriodStats();
  }, [selectedDate, selectedDays]);

  const fetchActiveUsers = async () => {
    try {
      const response = await getDailyActiveUsersHandler(
        { date: selectedDate },
        setIsLoading,
        setError
      );
      if (response) {
        setActiveUsers(response.users);
        setStats({
          totalActiveUsers: response.totalActiveUsers,
          date: response.date
        });
      }
    } catch (error) {
      setError('Failed to fetch active users');
    }
  };

  const fetchPeriodStats = async () => {
    try {
      const response = await getDailyActiveUsersStatsHandler(
        { days: selectedDays },
        setIsLoading,
        setError
      );
      if (response) {
        setPeriodStats(response);
      }
    } catch (error) {
      setError('Failed to fetch period stats');
    }
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected <= today) {
      setSelectedDate(selected);
    }
  };

  const handleDaysChange = (e) => {
    setSelectedDays(parseInt(e.target.value));
  };

  const handleBack = () => {
    navigate('/admin/dashboard/users');
  };

  const handleViewUser = (userId) => {
    navigate(`id/${userId}`);
  };

  const usersChartData = {
    labels: periodStats.stats.map(stat => stat.date),
    datasets: [
      {
        label: 'Active Users',
        data: periodStats.stats.map(stat => stat.uniqueUsers),
        borderColor: '#0a66c2',
        backgroundColor: 'rgba(10, 102, 194, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const requestsChartData = {
    labels: periodStats.stats.map(stat => stat.date),
    datasets: [
      {
        label: 'Total Requests',
        data: periodStats.stats.map(stat => stat.totalRequests),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Active Users Statistics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (error) {
    return (
      <div className="admin-users-error">
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchActiveUsers();
          fetchPeriodStats();
        }}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        {/* <button className="admin-users-back-button" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button> */}
        <h2>Active Users</h2>
      </div>

      <div className="admin-users-stats">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Total Active Users</h3>
            <div className="admin-users-stat-number">{stats.totalActiveUsers}</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-calendar-date"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Selected Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={today}
              className="admin-users-date-input"
            />
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Period (Days)</h3>
            <select 
              value={selectedDays} 
              onChange={handleDaysChange}
              className="admin-users-period-select"
            >
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Records Section */}
      <div className="admin-users-content">
        <h3>Active Users List</h3>
        {isLoading ? (
          <div className="admin-users-loading">
            <div className="admin-users-spinner"></div>
            <p>Loading active users...</p>
          </div>
        ) : activeUsers.length === 0 ? (
          <div className="admin-users-no-records">
            <i className="bi bi-exclamation-circle"></i>
            <p>No active users found for the selected date</p>
          </div>
        ) : (
          <div className="admin-users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Requests</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>
                      <div className="admin-users-info">
                        <img 
                          src={user.profile?.profileUrl
                            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${user.profile.profileUrl}`
                            : "/assets/Utils/male.png"} 
                          alt={user.name}
                          className="admin-users-avatar"
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.totalRequests}</td>
                    <td>{new Date(user.lastActive).toLocaleString()}</td>
                    <td>
                      <button 
                        className="admin-users-action-button view"
                        onClick={() => handleViewUser(user.userId)}
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Active Users Statistics Section */}
      <div className="admin-users-statistics">
        <h3>Daily Active Users Statistics</h3>
        <div className="admin-users-charts">
          <div className="admin-users-chart">
            <h4>Active Users Trend</h4>
            <Line data={usersChartData} options={chartOptions} />
          </div>
          <div className="admin-users-chart">
            <h4>Total Requests Trend</h4>
            <Line data={requestsChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

