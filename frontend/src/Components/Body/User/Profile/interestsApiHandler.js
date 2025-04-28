import { apiRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/profile/interests";

export const getInterestsHandler = async (data, setIsLoading, showAlert) => {
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

export const updateInterestsHandler = async (data, setIsLoading, showAlert) => {
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
