import axios from "axios";

export const DevelopmentFeedbackAPI = async (inputData) => {
  const response = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/ideaAI_development_feedback`, inputData);

  return response;
};

export const DevelopmentFeedbackResultAPI = async (jobId) => {
  const response = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/results_feedback/${jobId}`);

  return response;
};
