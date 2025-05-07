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
import './JoinedUsers.css';
import { getUserRegistrationStatsHandler } from '../userApiHandler';

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

export const JoinedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalUsers: 0,
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
    fetchJoinedUsers();
    fetchPeriodStats();
  }, [selectedDate, selectedDays]);

  const fetchJoinedUsers = async () => {
    try {
      const response = await getUserRegistrationStatsHandler(
        { date: selectedDate },
        setIsLoading,
        setError
      );
      if (response) {
        setJoinedUsers(response.users);
        setStats({
          totalUsers: response.totalUsers,
          date: response.date
        });
      }
    } catch (error) {
      setError('Failed to fetch joined users');
    }
  };

  const fetchPeriodStats = async () => {
    try {
      const response = await getUserRegistrationStatsHandler(
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
    navigate('/admin/users');
  };

  const usersChartData = {
    labels: periodStats.stats.map(stat => stat.date),
    datasets: [
      {
        label: 'New Registrations',
        data: periodStats.stats.map(stat => stat.count),
        borderColor: '#0a66c2',
        backgroundColor: 'rgba(10, 102, 194, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Registration Statistics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Registrations'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  if (error) {
    return (
      <div className="admin-users-error">
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchJoinedUsers();
          fetchPeriodStats();
        }}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <button className="admin-users-back-button" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h2>Joined Users</h2>
      </div>

      <div className="admin-users-stats">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Total Joined Users</h3>
            <div className="admin-users-stat-number">{stats.totalUsers}</div>
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
        <h3>Joined Users List</h3>
        {isLoading ? (
          <div className="admin-users-loading">
            <div className="admin-users-spinner"></div>
            <p>Loading joined users...</p>
          </div>
        ) : joinedUsers.length === 0 ? (
          <div className="admin-users-no-records">
            <i className="bi bi-exclamation-circle"></i>
            <p>No users joined on the selected date</p>
          </div>
        ) : (
          <div className="admin-users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {joinedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-users-info">
                        <img 
                          src={user.profileUrl
                            ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${user.profileUrl}`
                            : "/assets/Utils/male.png"} 
                          alt={user.name}
                          className="admin-users-avatar"
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <div className="admin-users-date">
                        <div className="admin-users-date-main">{formatDateTime(user.joinedAt)}</div>
                        <div className="admin-users-date-ago">
                          {getTimeAgo(user.joinedAt)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Registration Statistics Section */}
      <div className="admin-users-chart-container">
        <h3>Daily Registration Chart</h3>
        <div className="admin-users-chart">
          <Line data={usersChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
