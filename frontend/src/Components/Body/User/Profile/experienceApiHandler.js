import { apiRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/profile/experience";

//get -- post
//add --post
//delete --post
//update --post

export const getExperienceHandler = async (data, setIsLoading, showAlert) => {
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

export const addExperienceHandler = async (data, setIsLoading, showAlert) => {
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

export const deleteExperienceHandler = async (data, setIsLoading, showAlert) => {
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

export const updateExperienceHandler = async (data, setIsLoading, showAlert) => {
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
