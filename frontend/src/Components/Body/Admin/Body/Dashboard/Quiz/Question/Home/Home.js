import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../Quiz.css";
import { createHandler, quizHandler } from "../../apiHandler";
import { useAlert } from "../../../../../../../UI/Alert/AlertContext";
import { FaPlus, FaTrash, FaEye, FaPowerOff, FaTimes } from "react-icons/fa";

export const QuestionHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "text",
    weight: "1",
    hindiText: "",
  });
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { showAlert } = useAlert();
  const [details, setDetails] = useState({
    id: "",
    totalQuestions: 0,
    isActive: false,
    typeId: "",
  });
  const [dataUpdated, setDataUpdated] = useState(0);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [dataUpdated]);

  const fetchDetails = async () => {
    const response = await quizHandler(
      { quizId: params.id },
      "getQuiz",
      setIsLoading,
      showAlert
    );

    if (response) {
      setQuestions(response.questions);
      setDetails({
        id: response.quiz.id,
        totalQuestions: response.questions.length,
        isActive: response.quiz.isActive || false,
        typeId: response.quiz.typeId,
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("quizId", params.id);

    if (details.typeId === "personality") {
      formData = {
        text: {
          english: newQuestion.text,
          hindi: newQuestion.hindiText,
        },
        quizId: params.id,
      };
    } else {
      formData.append("text", newQuestion.text);
      formData.append("type", newQuestion.type);
      formData.append("weight", newQuestion.weight);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
    }

    let response;
    if (details.typeId === "personality") {
      response = await quizHandler(
        formData,
        "createPersonalityQuestion",
        setIsSubmitting,
        showAlert
      );
    } else {
      response = await createHandler(
        formData,
        "createQuestion",
        setIsSubmitting,
        showAlert
      );
    }

    if (response) {
      setDataUpdated(dataUpdated + 1);
      setNewQuestion({
        text: "",
        type: "text",
        weight: "1",
        hindiText: "",
      });
      setSelectedImage(null);
      setShowForm(false);
    }
  };

  const handleToggleActive = async () => {
    const response = await quizHandler(
      { quizId: params.id, isActive: !details.isActive },
      "updateQuiz",
      setIsActivating,
      showAlert
    );
    if (response) {
      setDetails((prev) => ({ ...prev, isActive: !prev.isActive }));
    }
  };

  const handleDeleteQuestion = async (id) => {
    const response = await quizHandler(
      { questionId: id, typeId: details.typeId },
      "deleteQuestion",
      setIsDeletingQuestion,
      showAlert
    );
    if (response) {
      setDataUpdated(dataUpdated + 1);
    }
  };

  const handleDeleteQuiz = async () => {
    setIsDeleting(true);
    const response = await quizHandler(
      { quizId: params.id },
      "deleteQuiz",
      setIsLoading,
      showAlert
    );
    if (response) {
      navigate("/admin/quiz");
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Loading Details...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div>
          <h2>Quiz Questions</h2>
          <p className="text-muted mb-0">Quiz ID: {details.id}</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={details.isActive ? "warning" : "success"}
            className="action-btn"
            onClick={handleToggleActive}
            disabled={isActivating}
          >
            <FaPowerOff className="me-2" />
            {isActivating ? (
              <Spinner animation="border" size="sm" />
            ) : details.isActive ? (
              "Deactivate Quiz"
            ) : (
              "Activate Quiz"
            )}
          </Button>
          <Button
            variant="danger"
            className="action-btn action-btn-danger"
            onClick={handleDeleteQuiz}
            disabled={isDeleting}
          >
            <FaTimes className="me-2" />
            {isDeleting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete Quiz"
            )}
          </Button>
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <Button
          variant="primary"
          className="action-btn action-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus className="me-2" />
          Create Question
        </Button>
      </div>

      {showForm && (
        <Card className="quiz-form-card">
          <Card.Body>
            <Form>
              {details.typeId === "personality" ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text (English)</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      value={newQuestion.text}
                      onChange={handleChange}
                      required
                      placeholder="Enter question in English"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Question Text (Hindi)</Form.Label>
                    <Form.Control
                      type="text"
                      name="hindiText"
                      value={newQuestion.hindiText}
                      onChange={handleChange}
                      required
                      placeholder="Enter question in Hindi"
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      value={newQuestion.text}
                      onChange={handleChange}
                      placeholder="Enter question text"
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
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={newQuestion.type}
                      onChange={handleChange}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="both">Both</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="weight"
                      value={newQuestion.weight}
                      onChange={handleChange}
                      min="0"
                    />
                  </Form.Group>
                </>
              )}
              <Button
                variant="success"
                onClick={handleCreateQuestion}
                className="action-btn action-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <FaPlus className="me-2" />
                )}
                Create Question
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <div className="quiz-table-container">
        <Table className="quiz-table">
          <thead>
            <tr>
              {details.typeId === "personality" ? (
                <>
                  <th>#</th>
                  <th>English</th>
                  <th>Hindi</th>
                  <th>Actions</th>
                </>
              ) : (
                <>
                  <th>#</th>
                  <th>Text</th>
                  <th>Image</th>
                  <th>Type</th>
                  <th>Weight</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id}>
                {details.typeId === "personality" ? (
                  <>
                    <td>{question.id}</td>
                    <td>{question.text.english || "N/A"}</td>
                    <td>{question.text.hindi || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`./question/${question.id}`}
                          className="action-btn action-btn-primary"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                        <Button
                          variant="danger"
                          className="action-btn action-btn-danger"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={isDeletingQuestion}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{question.id}</td>
                    <td>{question.text}</td>
                    <td>
                      {question.imageUrl ? (
                        <img
                          src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${question.imageUrl}`}
                          alt="Question"
                          height="80"
                          width="auto"
                          className="rounded"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{question.type}</td>
                    <td>{question.weight}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`./question/${question.id}`}
                          className="action-btn action-btn-primary"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                        <Button
                          variant="danger"
                          className="action-btn action-btn-danger"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={isDeletingQuestion}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
