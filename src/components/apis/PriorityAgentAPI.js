import axios from "axios";

export const PrioritiesAssessmentAPI = async (inputData) => {
  const response = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/ideaAI_priorities_assessment`, inputData);

  return response;
};

export const PrioritiesAssessmentResultAPI = async (jobId) => {
  const response = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/results_priorities/${jobId}`);

  return response;
};
