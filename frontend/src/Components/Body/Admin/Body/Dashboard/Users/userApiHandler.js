import { apiRequest, handleErrors } from "../../../../../../Utils/apiHandler";

const baseRoutes='/admin/users'

// Get all users
export const getUsersHandler = async (data,setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getUsers`;
  setIsLoading(true);
  const obj=data
  const adminToken = localStorage.getItem("adminToken");

  try {
    const result = await apiRequest(url, obj, adminToken, "post");
    const data = result.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Get user by ID
export const getUserByIdHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getUserById`;
  setIsLoading(true);
  const obj=data
  const adminToken = localStorage.getItem("adminToken");
  try {
    const result = await apiRequest(url, obj, adminToken, "post");
    const data = result.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Get users statistics
export const getUsersStatsHandler    = async (data,setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getUsersStats`;
  setIsLoading(true);
  const obj=data
  const adminToken = localStorage.getItem("adminToken");
  try {
    const result = await apiRequest(url, obj, adminToken, "post");
    const data = result.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

// Update user details
export const updateUserDetailsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/updateUserDetails`;
  const obj=data
  setIsLoading(true);
  const adminToken = localStorage.getItem("adminToken");
  try {
    const result = await apiRequest(url, obj, adminToken, "post");
    const data = result.data;
    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};
