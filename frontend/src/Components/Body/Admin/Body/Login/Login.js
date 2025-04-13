import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import "./Login.css"; // Importing CSS for styling
import { loginHandler } from "./apiHandler";
import { useAlert } from "../../../../UI/Alert/AlertContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogin, setAdminAuthToken } from "../../../../../Store/Admin/auth";
import { setAdminType } from "../../../../../Store/CommonInfo/commonInfo";

export const AdminLoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await loginHandler(
      userId,
      password,
      setIsSubmitting,
      showAlert
    );

    if (response) {
      const { token } = response;

      localStorage.setItem("adminToken", token);
      dispatch(adminLogin());
      dispatch(setAdminAuthToken(token));
      dispatch(setAdminType())

      navigate("/admin");
    }
  };

  return (
    <Container className="admin-login-container">
      <Row className="justify-content-center align-items-center vh-100 vw-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="admin-login-card shadow-lg">
            <Card.Body>
              <h2 className="admin-login-title text-center mb-4">Admin Login</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="userId">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    className="admin-login-input"
                    type="text"
                    placeholder="Enter your User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="admin-login-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="admin-login-button w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
