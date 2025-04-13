import { apiRequest, handleErrors } from "../../../../../Utils/apiHandler";

export const loginHandler = async (
  userName,
  password,
  setIsLoading,
  showAlert
) => {
  //above authentication will be here --
  const obj = { userName, password };
  const url = "/admin/auth/login";

  setIsLoading(true);

  try {
    const result = await apiRequest(url, obj, "", "post");
    const data = result.data;

    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};
