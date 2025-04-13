import { apiRequest, handleErrors } from "../../../../../../Utils/apiHandler";

export const getResultsHandler = async (data, setIsLoading, showAlert) => {
  const url = "/admin/result/getResults";
  const token = localStorage.getItem("adminToken");

  setIsLoading(true);
  try {
    const result = await apiRequest(url, data, token, "post");
    return result.data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};


export const getResultCount = async (data, setIsLoading, showAlert) => {
  const url = "/admin/result/getResultCount";
  const token = localStorage.getItem("adminToken");

  setIsLoading(true);
  try {
    const result = await apiRequest(url, data, token, "post");
    return result.data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};
