import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/categories/';

export const fetchJobCategories = () => {
  return axios.get(API_URL);
};
