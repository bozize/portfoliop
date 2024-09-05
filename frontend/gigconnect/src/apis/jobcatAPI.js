import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Change this to your actual base URL if different

// Job Categories API calls
export const fetchJobCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories/`);
  return response.data;
};

export const fetchJobCategoryDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${id}/`);
  return response.data;
};

export const fetchJobCategoryFreelancers = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${id}/freelancers/`);
  return response.data;
};

// Skills API calls
export const fetchSkills = async () => {
  const response = await axios.get(`${API_BASE_URL}/skills/`);
  return response.data;
};

export const fetchSkillDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/skills/${id}/`);
  return response.data;
};

export const fetchSkillFreelancers = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/skills/${id}/freelancers/`);
  return response.data;
};

// Profile API calls
export const updateFreelancerProfile = async (profileData) => {
  const response = await axios.post(`${API_BASE_URL}/profile/freelancer/`, profileData);
  return response.data;
};

export const updateClientProfile = async (profileData, token) => {
  const response = await axios.post(`${API_BASE_URL}/profile/client/`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
