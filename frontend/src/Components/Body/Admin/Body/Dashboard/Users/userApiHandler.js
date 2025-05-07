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


//getDailyActiveUsers
export const getDailyActiveUsersHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getDailyActiveUsers`;
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


//getDailyActiveUsersStats
export const getDailyActiveUsersStatsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getDailyActiveUsersStats`;
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

//getUserActivityStats
export const getUserActivityStatsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getUserActivityStats`;
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


//getUserRegistrationStats
export const getUserRegistrationStatsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getUserRegistrationStats`;
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
