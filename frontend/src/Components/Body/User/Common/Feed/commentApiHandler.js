import { apiRequest, handleErrors } from "../../../../../Utils/apiHandler";

const baseRoute = '/user/comments';

export const createCommentHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/create`;
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

export const updateCommentHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/update`;
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

export const deleteCommentHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/delete`;
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

export const getFeedCommentsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/getFeedComments`;
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
