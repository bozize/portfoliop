// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientSlice';
import { loginReducer, freelancerSignupReducer, clientSignupReducer } from './reducers/authReducer';
import freelancerReducer from './freelancerSlice';
import jobcatReducer from './jobcatSlice';
import jobReducer from './jobsSlice';
import authReducer from './authSlice';// Import the jobcat reducer

export const store = configureStore({
  reducer: {
    client: clientReducer,
    login: loginReducer,
    freelancerSignup: freelancerSignupReducer,
    clientSignup: clientSignupReducer,
    freelancer: freelancerReducer,
    jobCategories: jobcatReducer,
    jobs: jobReducer,
    auth: authReducer, // Add this line
    // ... other reducers
  },
});
export default store

