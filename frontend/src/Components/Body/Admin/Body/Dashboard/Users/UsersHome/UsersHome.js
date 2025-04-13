import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEye } from "react-icons/fa";
import "../Users.css";

// Dummy data for demonstration
const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    date: "2024-03-15",
    time: "14:30",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 98765 43211",
    date: "2024-03-14",
    time: "15:45",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    phone: "+91 98765 43212",
    date: "2024-03-13",
    time: "09:15",
  },
  // Add more dummy users as needed
];

export const UsersHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter users based on search term
  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Users Management</h2>
        <div className="users-stats">
          <div className="stat-card">
            <h3>{dummyUsers.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{dummyUsers.filter(user => new Date(user.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</h3>
            <p>New Users (Last 7 days)</p>
          </div>
          <div className="stat-card">
            <h3>{dummyUsers.filter(user => new Date(user.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</h3>
            <p>Active Users (Last 30 days)</p>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    {user.name}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FaEnvelope className="me-2" />
                    {user.email}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FaPhone className="me-2" />
                    {user.phone}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FaCalendar className="me-2" />
                    {user.date} {user.time}
                  </div>
                </td>
                <td>
                  <Link to={`/admin/users/id/${user.id}`} className="view-more-btn">
                    <FaEye className="me-1" />
                    View More
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

