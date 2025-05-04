import { apiRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/messages";

// Send a new message
export const sendMessageHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/sendMessage`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Get a specific conversation
export const getConversationHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getConversation`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Get all conversations
export const getAllConversationsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getAllConversations`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Mark messages as read
export const markAsReadHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/markAsRead`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Delete a message
export const deleteMessageHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/deleteMessage`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

