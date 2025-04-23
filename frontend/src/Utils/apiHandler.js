import axios from "axios";
import { baseUrl } from "./config";
import { Store } from "../Store";
import { setUserAuthToken, userLogOut } from "../Store/User/auth";
import { adminLogout, setAdminAuthToken } from "../Store/Admin/auth";

export const apiRequest = async (url, obj = {}, token = "", type = "get") => {
  const completeUrl = `${baseUrl}${url}`;

  const headers = {
    Authorization: token || "", // Fallback for optional token
    "Content-Type": "application/json", // Standard for API requests
  };

  let result;
  if (type === "get") {
    result = await axios.get(completeUrl, { headers });
  } else if (type === "post") {
    result = await axios.post(completeUrl, obj, { headers });
  } else {
    throw new Error("Unsupported request type. Use 'get' or 'post'.");
  }

  return result; // Return only the response data
};

export const apiUploadRequest = async (url, obj = {}, token = "") => {
  const completeUrl = `${baseUrl}${url}`;
  const headers = {
    Authorization: token || "", // Fallback for optional token
    "Content-Type": "multipart/form-data", // Standard for API requests
  };

  const result = await axios.post(completeUrl, obj, { headers });

  return result; // Return only the response data
};

export const handleErrors = async (err, showAlert) => {
  // Declare variables
  let logMessage = null;
  let alertMessage = null;
  let response = null;

 
  // Check if the error has no response (network/server issue)
  if (!err.response) {
    logMessage = "Network error or server is not responding: " + err;
    alertMessage =
      "Network error or server is not responding. Please try again later.";
  } else {
    response = err.response;

    // Check if response.status exists in mapFunction, and call the corresponding function

    // Check if the response contains specific error details
    if (response.data && response.data.errors) {
      alertMessage = "Please fix the following errors:\n";
      Object.keys(response.data.errors).forEach((er) => {
        alertMessage += response.data.errors[er] + " || ";
      });
    } else if (response.data && response.data.message) {
      alertMessage = response.data.message; // Message from server
    } else if (response.data && response.data.error) {
      alertMessage = response.data.error; // Error message from server
    } else {
      alertMessage = "An unexpected error occurred. Please try again.";
    }

    logMessage = "Error response: " + JSON.stringify(response);
  }

  // Log the error if log argument is true and logMessage exists
  if (logMessage) {
    console.log(logMessage);
  }

  // Show alert if alertMsg argument is true and alertMessage exists

  if (alertMessage) {
    showAlert(alertMessage);
  }

  if (response && response.status === 503) {
    const state = Store.getState();
    const userType = state.commonInfo.userType;

    localStorage.removeItem("token");
    Store.dispatch(userLogOut());
    Store.dispatch(setUserAuthToken(null));

    localStorage.removeItem("adminToken");
    Store.dispatch(adminLogout());
    Store.dispatch(setAdminAuthToken(null));
  }
};
