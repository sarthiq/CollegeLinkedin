import { apiRequest, handleErrors } from "../../../../../Utils/apiHandler";

const baseRoute = '/user/likes';

//toggleLike
//getLikeStatus
//getFeedLikes 

export const toggleLikeHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/toggleLike`;
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

export const getLikeStatusHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/getLikeStatus`;
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

export const getFeedLikesHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoute}/getFeedLikes`;
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

