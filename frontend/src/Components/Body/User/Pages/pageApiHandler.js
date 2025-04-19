import {
  apiRequest,
  apiUploadRequest,
  handleErrors,
} from "../../../../Utils/apiHandler";

const baseRoutes = "/user/pages";

export const createPageHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/create`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiUploadRequest(url, obj, token);
    const responseData = response.data;
    return responseData;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

export const updatePageHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/update`;
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

export const deletePageHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/delete`;

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

export const toggleFollowPageHandler = async (
  data,
  setIsLoading,
  showAlert
) => {
  const url = `${baseRoutes}/toggleFollow`;
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

export const getAllPagesHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getAllPages`;
  const obj = data;
  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token, "post");
    
    const data = response.data;
    return data;
  } catch (e) {
    console.log(e);
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

export const getPageByIdHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getPageById`;
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
