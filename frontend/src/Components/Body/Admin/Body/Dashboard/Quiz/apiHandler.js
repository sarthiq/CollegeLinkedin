import { apiRequest, apiUploadRequest, handleErrors } from "../../../../../../Utils/apiHandler";

export const createHandler = async (formData, typeUrl, setIsLoading, showAlert) => {
  //above authentication will be here --
  const obj = formData;
  const url = `/admin/quiz/${typeUrl}`;

  setIsLoading(true);

  try {
    const token = localStorage.getItem("adminToken");
    
    const result = await apiUploadRequest(url, obj, token);
    const data = result.data;

    return data;
  } catch (e) {
    handleErrors(e, showAlert);
  } finally {
    setIsLoading(false);
  }
};

export const quizHandler = async (formData, typeUrl, setIsLoading, showAlert) => {
    //above authentication will be here --
    const obj = formData;
    const url = `/admin/quiz/${typeUrl}`;
  
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("adminToken");
      const result = await apiRequest(url, obj, token, "post");
      const data = result.data;
  
      return data;
    } catch (e) {
      handleErrors(e, showAlert);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  
    