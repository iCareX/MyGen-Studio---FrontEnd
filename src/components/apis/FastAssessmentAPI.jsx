import axios from "axios";

export const FastAssessmentAPI = async (inputData) => {
  const response = await axios.post(`${import.meta.env.VITE_APP_PUBLIC_URL}/ideaAI_fast_assessment`, inputData);

  return response;
};

export const FastAssessmentResultFastAPI = async (jobId) => {
  const response = await axios.get(`${import.meta.env.VITE_APP_PUBLIC_URL}/results_fast/${jobId}`);

  return response;
};
