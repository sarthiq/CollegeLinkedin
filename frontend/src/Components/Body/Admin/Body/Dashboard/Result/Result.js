import React, { useState, useEffect } from "react";
import { Container, Table, Form, Spinner, Pagination, Button, ToggleButton } from "react-bootstrap";
import { useAlert } from "../../../../../UI/Alert/AlertContext";
import { getResultsHandler, getResultCount } from "./apiHandler";
import "./Result.css";
import { quizHandler } from "../Quiz/apiHandler";
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaFileExcel, FaFilter, FaTimes, FaDownload } from "react-icons/fa";

export const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [quizzes, setQuizzes] = useState([]);
  const [isCertified, setIsCertified] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 50,
  });
  const { showAlert } = useAlert();

  const recordsPerPageOptions = [50, 100, 200, 500, 1000];

  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  useEffect(() => {
    fetchTotalCount();
  }, [filter, isCertified, dateRange]);

  useEffect(() => {
    fetchResults();
  }, [filter, pagination.currentPage, pagination.itemsPerPage, isCertified, dateRange]);

  const fetchQuizzes = async () => {
    const response = await quizHandler({}, "getQuizzes", setLoading, showAlert);
    if (response) {
      setQuizzes(response.data);
    }
  };

  const fetchTotalCount = async () => {
    const data = {
      quizId: filter !== "all" ? filter : null,
      startDate: dateRange.startDate ? dateRange.startDate.toISOString() : null,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : null
    };
   
    const response = await getResultCount(data, setLoading, showAlert);
    if (response && response.success) {
      setPagination((prev) => ({
        ...prev,
        totalItems: response.totalResults,
        totalPages: Math.ceil(response.totalResults / prev.itemsPerPage),
      }));
    }
  };

  const fetchResults = async () => {
    const data = {
      quizId: filter !== "all" ? filter : null,
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      isCertified,
      startDate: dateRange.startDate ? dateRange.startDate.toISOString() : null,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : null
    };

    const response = await getResultsHandler(data, setLoading, showAlert);
    if (response && response.success) {
      setResults(response.results);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
      }));
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  const handleRecordsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newLimit,
      currentPage: 1,
      totalPages: Math.ceil(prev.totalItems / newLimit),
    }));
  };

  const handleDateRangeReset = () => {
    setDateRange({
      startDate: null,
      endDate: null
    });
  };

  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={pagination.currentPage === 1}
        onClick={() => handlePageChange(pagination.currentPage - 1)}
      />
    );

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === pagination.currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1)
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      items.push(
        <Pagination.Item
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() => handlePageChange(pagination.currentPage + 1)}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  const exportToExcel = () => {
    try {
      const exportData = results.map(result => ({
        'Name': result.UnverifiedUser?.name || 'N/A',
        'Email': result.UnverifiedUser?.email || 'N/A',
        'Age': result.UnverifiedUser?.age || 'N/A',
        'Quiz Type': result.type.toUpperCase(),
        'Result': getFormattedResult(result),
        'Date': new Date(result.createdAt).toLocaleString()
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Quiz Results');
      const fileName = `quiz_results_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      showAlert('Excel file exported successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showAlert('Failed to export Excel file', 'error');
    }
  };

  const getFormattedResult = (result) => {
    if (result.type === 'iq') {
      return result.result?.label || 'N/A';
    } else if (result.type === 'personality') {
      return `Openness: ${result.result?.openness?.toFixed(1)}%, ` +
        `Neuroticism: ${result.result?.neuroticism?.toFixed(1)}%, ` +
        `Extraversion: ${result.result?.extraversion?.toFixed(1)}%, ` +
        `Agreeableness: ${result.result?.agreeableness?.toFixed(1)}%, ` +
        `Conscientiousness: ${result.result?.conscientiousness?.toFixed(1)}%`;
    } else if (result.type === 'creativity') {
      return result.result?.label || 'N/A';
    }
    return result.score || 'N/A';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading Results...</p>
      </div>
    );
  }

  return (
    <div className="result-admin-container">
      <div className="filters-container">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Quiz Results</h2>
          <Button 
            variant="success" 
            onClick={exportToExcel}
            className="export-button"
            disabled={results.length === 0}
          >
            <FaFileExcel className="me-2" />
            Export to Excel
          </Button>
        </div>
        <div className="filters-wrapper">
          <div className="filter-group">
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Quizzes</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </Form.Select>

            <Form.Select
              value={pagination.itemsPerPage}
              onChange={handleRecordsPerPageChange}
              className="records-select"
            >
              {recordsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} records per page
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="filter-group">
            <ToggleButton
              id="certified-toggle"
              type="checkbox"
              variant="outline-primary"
              checked={isCertified}
              value="1"
              onChange={(e) => setIsCertified(e.currentTarget.checked)}
              className="certified-toggle"
            >
              <FaFilter className="me-2" />
              {isCertified ? 'Certified Only' : 'All Results'}
            </ToggleButton>

            <div className="date-range-picker">
              <DatePicker
                selectsRange={true}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={(update) => {
                  setDateRange({
                    startDate: update[0],
                    endDate: update[1]
                  });
                }}
                isClearable={true}
                placeholderText="Select date range"
                className="form-control"
              />
              {(dateRange.startDate || dateRange.endDate) && (
                <Button 
                  variant="link" 
                  className="clear-dates-btn"
                  onClick={handleDateRangeReset}
                >
                  <FaTimes />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="results-info">
        Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
        {Math.min(
          pagination.currentPage * pagination.itemsPerPage,
          pagination.totalItems
        )}{" "}
        of {pagination.totalItems} results
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Quiz Type</th>
            <th>Score/Result</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.UnverifiedUser?.name || "N/A"}</td>
              <td>{result.UnverifiedUser?.email || "N/A"}</td>
              <td>{result.UnverifiedUser?.age || "N/A"}</td>
              <td>{result.type.toUpperCase() || "N/A"}</td>
              <td>
                {result.type === 'personality' ? (
                  <div className="personality-result">
                    <div>Openness: {result.result?.openness?.toFixed(1)}%</div>
                    <div>Neuroticism: {result.result?.neuroticism?.toFixed(1)}%</div>
                    <div>Extraversion: {result.result?.extraversion?.toFixed(1)}%</div>
                    <div>Agreeableness: {result.result?.agreeableness?.toFixed(1)}%</div>
                    <div>Conscientiousness: {result.result?.conscientiousness?.toFixed(1)}%</div>
                  </div>
                ) : (
                  result.type === 'iq' ? result.result?.label :
                  result.type === 'creativity' ? result.result?.label :
                  result.score || 'N/A'
                )}
              </td>
              <td>{new Date(result.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination-container">
        {renderPagination()}
      </div>
    </div>
  );
};
