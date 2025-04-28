import { apiRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/profile/education";

export const getEducationHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/get`;
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

export const addEducationHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/add`;
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

export const deleteEducationHandler = async (data, setIsLoading, showAlert) => {
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

export const updateEducationHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/update`;
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
