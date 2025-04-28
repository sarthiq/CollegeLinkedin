import { apiRequest, apiUploadRequest, handleErrors } from "../../../../Utils/apiHandler";

const baseRoutes = "/user/internships";

// Basic CRUD operations
export const createInternshipHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/create`;
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

export const getAllInternshipsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getAll`;
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

export const getInternshipByIdHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getById`;
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

export const updateInternshipHandler = async (data, setIsLoading, showAlert) => {
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

export const deleteInternshipHandler = async (data, setIsLoading, showAlert) => {
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

// Application related operations
export const applyForInternshipHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/apply`;
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

export const getAppliedInternshipsHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/getApplied`;
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

export const withdrawInternshipHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/withdraw`;
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

export const updateUserStatusHandler = async (data, setIsLoading, showAlert) => {
  const url = `${baseRoutes}/updateUserStatus`;
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