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
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import "./AnswerHome.css";
import { useAlert } from "../../../../../../../UI/Alert/AlertContext";
import { createHandler, quizHandler } from "../../apiHandler";

export const AnswerHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState({
    text: "",
    type: "text",
  });
  const params = useParams();
  const navigate = useNavigate(); // For navigation
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [answers, setAnswers] = useState([]);
  const { showAlert } = useAlert();
  const [details, setDetails] = useState({
    id: "",
    question: "",
    weight: "",
    totalAnswers: 0,
    correctAnswerId: "",
  });
  const [dataUpdated, setDataUpdated] = useState(0);
  const [isActivatingQuestion, setIsActivatingQuestion] = useState(false); // For question activation
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false); // For question deletion
  const [isActivatingAnswer, setIsActivatingAnswer] = useState({}); // For answer activation
  const [isDeletingAnswer, setIsDeletingAnswer] = useState({}); // For answer deletion
  const [tempLoading, setTempLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [dataUpdated]);

  const fetchDetails = async () => {
    const response = await quizHandler(
      { questionId: params.qid },
      "getQuestion",
      setLoading,
      showAlert
    );

    if (response) {
      setAnswers(response.answers);
      setDetails({
        id: response.question.id,
        weight: response.question.weight,
        question: response.question.text,
        totalAnswers: response.answers.length,
        correctAnswerId: response.question.correctAnswerId,
      });
      // Initialize activation states for answers
      const initialActivationStates = {};
      response.answers.forEach((answer) => {
        initialActivationStates[answer.id] = answer.active || false;
      });
      setIsActivatingAnswer(initialActivationStates);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
  };

  const handleCreateAnswer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("questionId", params.qid);
    formData.append("text", newAnswer.text);
    formData.append("type", newAnswer.type);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const response = await createHandler(
      formData,
      "createAnswer",
      setCreating,
      showAlert
    );

    if (response) {
      setDataUpdated(dataUpdated + 1);
      setNewAnswer({ text: "", type: "text" }); // Reset form
      setSelectedImage(null); // Clear selected image
      setShowForm(false); // Hide form after submission
    }
  };

  const handleToggleQuestionActive = async () => {
    const response = await quizHandler(
      { questionId: params.qid, isActive: !details.isActive },
      "updateQuestion",
      setIsActivatingQuestion,
      showAlert
    );
    if (response) {
      setDetails((prev) => ({ ...prev, isActive: !prev.isActive }));
    }
  };

  const handleDeleteQuestion = async () => {
    const response = await quizHandler(
      { questionId: params.qid },
      "deleteQuestion",
      setIsDeletingQuestion,
      showAlert
    );
    if (response) {
      navigate("../"); // Redirect to quizzes list after deletion
    }
  };

  const handleToggleAnswerActive = async (answerId) => {
    console.log(answerId);
    // setIsActivatingAnswer((prev) => ({ ...prev, [answerId]: true })); // Set loading state

    // const response = await quizHandler(
    //   { answerId, isActive: !isActivatingAnswer[answerId] },
    //   "updateAnswer",
    //   setTempLoading,
    //   showAlert
    // );

    // if (response) {
    //   setIsActivatingAnswer((prev) => ({
    //     ...prev,
    //     [answerId]: !prev[answerId],
    //   }));
    //   setDataUpdated((prev) => prev + 1); // Force UI refresh
    // } else {
    //   setIsActivatingAnswer((prev) => ({ ...prev, [answerId]: false })); // Revert if failed
    // }
  };

  const handleDeleteAnswer = async (answerId) => {
    setIsDeletingAnswer((prev) => ({ ...prev, [answerId]: true }));
    const response = await quizHandler(
      { answerId },
      "deleteAnswer",
      setTempLoading,
      showAlert
    );
    if (response) {
      setDataUpdated(dataUpdated + 1); // Refresh data
    }
    setIsDeletingAnswer((prev) => ({ ...prev, [answerId]: false }));
  };

  const handleSetCorrectAnswer = async (answerId) => {
    const response = await quizHandler(
      { correctAnswerId: answerId, questionId: params.qid },
      "setCorrectAnswer",
      setTempLoading,
      showAlert
    );

    if (response) {
      showAlert("Correct answer set successfully!", "success");
      setDataUpdated((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading Details...</p>
      </div>
    );
  }

  return (
    <Container className="answer-page">
      {/* Question Status Section */}
      <Row className="question-status">
        <Col md={6}>
          <h4>Question Title: {details.question}</h4>
          <p>
            Weight: {details.weight} | Question ID: {details.id}
          </p>
          <p>
            Total Answers: {details.totalAnswers} | Answer ID:{" "}
            {details.correctAnswerId}
          </p>
        </Col>
        <Col md={6} className="question-actions">
          <Button
            variant={details.isActive ? "warning" : "success"}
            onClick={handleToggleQuestionActive}
            disabled={isActivatingQuestion}
          >
            {isActivatingQuestion ? (
              <Spinner animation="border" size="sm" />
            ) : details.isActive ? (
              "Deactivate Question"
            ) : (
              "Activate Question"
            )}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteQuestion}
            disabled={isDeletingQuestion}
            className="ms-2"
          >
            {isDeletingQuestion ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete Question"
            )}
          </Button>
        </Col>
      </Row>

      {/* Create Answer Button */}
      <Row>
        <Col className="text-center">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            Create Answer
          </Button>
        </Col>
      </Row>

      {/* Create Answer Form */}
      {showForm && (
        <Row className="answer-form">
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group controlId="answerText">
                    <Form.Label>Answer Text (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      value={newAnswer.text}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Image (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="answerType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={newAnswer.type}
                      onChange={handleChange}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="both">Both</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="success"
                    onClick={handleCreateAnswer}
                    className="mt-3"
                    disabled={creating}
                  >
                    {creating ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Create Answer"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Answer List */}
      <Row className="answer-list">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Text</th>
                <th>Image</th>
                <th>Type</th>
                <th>Is Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer) => (
                <tr key={answer.id}>
                  <td>{answer.id}</td>
                  <td>{answer.text || "N/A"}</td>
                  <td>
                    {answer.imageUrl ? (
                      <img
                        src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${answer.imageUrl}`}
                        alt="Answer"
                        height="80"
                        width="auto"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{answer.type}</td>
                  <td>
                    {details.correctAnswerId === answer.id ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ✔
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ✘
                      </span>
                    )}
                  </td>

                  <td>
                    <Button
                      variant={
                        isActivatingAnswer[answer.id] ? "warning" : "success"
                      }
                      onClick={() => handleToggleAnswerActive(answer.id)}
                      disabled={tempLoading}
                    >
                      {isActivatingAnswer[answer.id]
                        ? "Deactivate"
                        : "Activate"}
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDeleteAnswer(answer.id)}
                      disabled={isDeletingAnswer[answer.id]}
                      className="ms-2"
                    >
                      {isDeletingAnswer[answer.id] ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                    <Button
                      variant="primary"
                      className="ms-2"
                      onClick={() => handleSetCorrectAnswer(answer.id)}
                    >
                      Set Correct Answer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
