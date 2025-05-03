import { apiRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/search";

export const searchHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}`;
  const obj = data;

  setIsLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await apiRequest(url, obj, token,"post");
    const data = response.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};
