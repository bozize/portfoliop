// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { freelancerSignupReducer, clientSignupReducer, loginReducer } from './reducers/authReducer';
import jobCategoriesReducer from './jobcatSlice';

const store = configureStore({
  reducer: {
    freelancerSignup: freelancerSignupReducer,
    clientSignup: clientSignupReducer,
    login: loginReducer,
    jobCategories: jobCategoriesReducer,
  },
});

export default store;


