import { apiRequest, apiUploadRequest, handleErrors } from "../../../../../Utils/apiHandler";

const baseRoute = '/user/feeds';

export const createFeedHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/create`;
  const obj = data;
  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiUploadRequest(url, obj, token);
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

export const updateFeedHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/update`;
  const obj = data;
  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiUploadRequest(url, obj, token);
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

export const deleteFeedHandler = async (data, setIsLoading, showAlert) => {
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

export const getFeedByIdHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/getFeedById`;
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

export const getAllFeedsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/getAllFeeds`;
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

