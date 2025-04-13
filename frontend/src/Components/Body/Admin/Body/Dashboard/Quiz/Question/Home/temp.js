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
import { Link, useParams } from "react-router-dom";

import { createHandler, quizHandler } from "../../apiHandler";
import { useAlert } from "../../../../../../../UI/Alert/AlertContext";

export const QuestionHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [details, setDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "text",
    weight: "1",
    hindiText: "",
  });

  const params = useParams();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await quizHandler(
        { quizId: params.id },
        "getQuiz",
        showAlert
      );
      console.log(response);
      if (response) {
        setQuestions(response.questions);
        setDetails(response.details);
      }
    };
    fetchQuestions();
  }, [params.id, dataUpdated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("quizId", params.id);

    if (details.typeId === "personality") {
      formData.append(
        "text",
        JSON.stringify({
          english: newQuestion.text,
          hindi: newQuestion.hindiText,
        })
      );
    } else {
      formData.append("text", newQuestion.text);
      formData.append("type", newQuestion.type);
      formData.append("weight", newQuestion.weight);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
    }

    const response = await createHandler(
      formData,
      details.typeId === "personality"
        ? "createPersonalityQuestion"
        : "createQuestion",
      setIsSubmitting,
      showAlert
    );

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

  return (
    <Container className="question-home">
      <Row className="mb-4">
        <Col>
          <h2>Questions</h2>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add New Question"}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="question-form mb-4">
          <Col md={8} className="mx-auto">
            <Card>
              <Card.Body>
                <Form onSubmit={handleCreateQuestion}>
                  {details.typeId === "personality" ? (
                    <>
                      <Form.Group
                        className="mb-3"
                        controlId="questionTextEnglish"
                      >
                        <Form.Label>Question Text (English)</Form.Label>
                        <Form.Control
                          type="text"
                          name="text"
                          value={newQuestion.text}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="questionTextHindi"
                      >
                        <Form.Label>Question Text (Hindi)</Form.Label>
                        <Form.Control
                          type="text"
                          name="hindiText"
                          value={newQuestion.hindiText}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Group className="mb-3" controlId="questionText">
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                          type="text"
                          name="text"
                          value={newQuestion.text}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="questionType">
                        <Form.Label>Question Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={newQuestion.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="questionWeight">
                        <Form.Label>Question Weight</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={newQuestion.weight}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      {newQuestion.type === "image" && (
                        <Form.Group className="mb-3" controlId="questionImage">
                          <Form.Label>Question Image</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            required
                          />
                        </Form.Group>
                      )}
                    </>
                  )}

                  <Button
                    variant="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Create Question"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="question-list">
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                {details.typeId === "personality" ? (
                  <th>Text (English/Hindi)</th>
                ) : (
                  <>
                    <th>Text</th>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Weight</th>
                  </>
                )}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  {details.typeId === "personality" ? (
                    <td>
                      {question.text &&
                        typeof question.text === "string" &&
                        (() => {
                          try {
                            const parsedText = JSON.parse(question.text);
                            return (
                              <>
                                <div>
                                  <strong>English:</strong> {parsedText.english}
                                </div>
                                <div>
                                  <strong>Hindi:</strong> {parsedText.hindi}
                                </div>
                              </>
                            );
                          } catch (e) {
                            return question.text;
                          }
                        })()}
                    </td>
                  ) : (
                    <>
                      <td>{question.text || "N/A"}</td>
                      <td>
                        {question.imageUrl ? (
                          <img
                            src={`${process.env.REACT_APP_REMOTE_ADDRESS}/${question.imageUrl}`}
                            alt="Question"
                            height="100"
                            width="auto"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{question.type}</td>
                      <td>{question.weight}</td>
                    </>
                  )}
                  <td>
                    <Link
                      to={`./question/${question.id}`}
                      className="view-more-btn"
                    >
                      View More
                    </Link>
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
