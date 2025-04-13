import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Quiz.css";
import { createHandler, quizHandler } from "../apiHandler";
import { useAlert } from "../../../../../../UI/Alert/AlertContext";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

export const QuizHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    typeId: "",
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const response = await quizHandler({}, "getQuizzes", setLoading, showAlert);
    if (response) {
      setQuizzes(response.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", quizData.title);
    formData.append("description", quizData.description);
    formData.append("typeId", quizData.typeId);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const response = await createHandler(
      formData,
      "createQuiz",
      setSubmitting,
      showAlert
    );

    if (response) {
      setQuizData({
        title: "",
        description: "",
        typeId: "",
      });
      setSelectedImage(null);
      setShowForm(false);
      fetchQuizzes();
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz Management</h2>
        <Button
          className="quiz-create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus className="me-2" />
          {showForm ? "Close Form" : "Create Quiz"}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mx-3">
          {error}
        </Alert>
      )}

      {showForm && (
        <Card className="quiz-form-card mx-3">
          <Card.Body>
            <Form onSubmit={handleCreateQuiz}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={quizData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter quiz title"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={quizData.description}
                  onChange={handleChange}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type ID</Form.Label>
                <Form.Select
                  name="typeId"
                  value={quizData.typeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="iq">IQ Test</option>
                  <option value="personality">Personality Test</option>
                  <option value="aptitude">Aptitude Test</option>
                </Form.Select>
              </Form.Group>

              <Button
                className="action-btn action-btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <FaPlus className="me-2" />
                )}
                Create Quiz
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <h3 className="quiz-list-header">Available Quizzes</h3>

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" role="status" />
          <p>Loading quizzes...</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="quiz-card">
              {quiz.imageUrl && (
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${quiz.imageUrl}`}
                  className="quiz-image"
                  alt={quiz.title}
                />
              )}
              <Card.Body>
                <Card.Title>{quiz.title}</Card.Title>
                <Card.Text>{quiz.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="status-badge status-active">
                    {quiz.typeId}
                  </span>
                  <div className="d-flex gap-2">
                    <Link
                      to={`./${quiz.id}`}
                      className="action-btn action-btn-primary"
                    >
                      <FaEye className="me-1" />
                      View
                    </Link>
                    <Button
                      variant="danger"
                      className="action-btn action-btn-danger"
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
