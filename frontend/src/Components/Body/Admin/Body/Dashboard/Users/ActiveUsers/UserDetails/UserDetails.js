import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { getUserActivityStatsHandler } from '../../userApiHandler';
import './UserDetails.css';

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

export const UserDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchUserActivityStats();
  }, [selectedDays]);

  const fetchUserActivityStats = async () => {
    try {
      const response = await getUserActivityStatsHandler(
        { userId: id, days: selectedDays },
        setIsLoading,
        setError
      );
      if (response) {
        setUserData(response);
      }
    } catch (error) {
      setError('Failed to fetch user activity stats');
    }
  };

  const handleDaysChange = (e) => {
    setSelectedDays(parseInt(e.target.value));
  };

  const handleBack = () => {
    navigate('/admin/dashboard/users/active-users');
  };

  const chartData = {
    labels: userData?.activity.map(stat => stat.date) || [],
    datasets: [
      {
        label: 'Daily Requests',
        data: userData?.activity.map(stat => stat.totalRequests) || [],
        borderColor: '#0a66c2',
        backgroundColor: 'rgba(10, 102, 194, 0.1)',
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
        text: 'User Activity Statistics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Requests'
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

  if (error) {
    return (
      <div className="admin-users-error">
        <p>{error}</p>
        <button onClick={() => {
          setError(null);
          fetchUserActivityStats();
        }}>Try Again</button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="admin-users-loading">
        <div className="admin-users-spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <button className="admin-users-back-button" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h2>User Activity Details</h2>
      </div>

      {/* User Info Card */}
      <div className="admin-users-user-card">
        <div className="admin-users-user-info">
          <img 
            src={userData.user.profileUrl
              ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${userData.user.profileUrl}`
              : "/assets/Utils/male.png"} 
            alt={userData.user.name}
            className="admin-users-user-avatar"
          />
          <div className="admin-users-user-details">
            <h3>{userData.user.name}</h3>
            <p><i className="bi bi-envelope"></i> {userData.user.email}</p>
            <p><i className="bi bi-telephone"></i> {userData.user.phone}</p>
          </div>
        </div>
        <div className="admin-users-period-selector">
          <label>Activity Period:</label>
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

      {/* Activity Stats */}
      <div className="admin-users-stats">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Period</h3>
            <div className="admin-users-stat-number">
              {userData.period.startDate} to {userData.period.endDate}
            </div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-activity"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Total Requests</h3>
            <div className="admin-users-stat-number">
              {userData.activity.reduce((sum, day) => sum + day.totalRequests, 0)}
            </div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="admin-users-stat-content">
            <h3>Last Active</h3>
            <div className="admin-users-stat-number">
              {new Date(userData.activity[userData.activity.length - 1]?.lastActive).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="admin-users-chart-container">
        <h3>Daily Activity Chart</h3>
        <div className="admin-users-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      
    </div>
  );
};

