import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./Login.css"; // Importing CSS for styling
import { loginHandler } from "./apiHandler";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogin, setAdminAuthToken } from "../../../../../Store/Admin/auth";
import { setAdminType } from "../../../../../Store/CommonInfo/commonInfo";

export const AdminLoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    
      const response = await loginHandler(
        userId,
        password,
        setIsSubmitting,
        (error) => setError(error)
      );
      
      if (response && response.token) {
        localStorage.setItem("adminToken", response.token);
        dispatch(adminLogin());
        dispatch(setAdminAuthToken(response.token));
        dispatch(setAdminType());
        navigate("/admin");
      } 
      
      
  };

  return (
    <div className="admin-login-wrapper">
      <Container className="admin-login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="admin-login-card">
              <Card.Body className="admin-login-card-body">
                <div className="admin-login-header">
                  <h2 className="admin-login-title">Admin Login</h2>
                  <p className="admin-login-subtitle">Welcome back! Please enter your credentials</p>
                </div>

                {error && (
                  <Alert variant="danger" className="admin-login-alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="admin-login-form">
                  <Form.Group className="admin-login-form-group" controlId="userId">
                    <Form.Label className="admin-login-label">User ID</Form.Label>
                    <div className="admin-login-input-wrapper">
                      <i className="bi bi-person admin-login-input-icon"></i>
                      <Form.Control
                        className="admin-login-input"
                        type="text"
                        placeholder="Enter your User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="admin-login-form-group" controlId="password">
                    <Form.Label className="admin-login-label">Password</Form.Label>
                    <div className="admin-login-input-wrapper">
                      <i className="bi bi-lock admin-login-input-icon"></i>
                      <Form.Control
                        className="admin-login-input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="admin-login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
