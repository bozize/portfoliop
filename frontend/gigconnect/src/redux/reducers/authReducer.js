// src/redux/reducers/authReducer.js
import {
    FREELANCER_SIGNUP_REQUEST,
    FREELANCER_SIGNUP_SUCCESS,
    FREELANCER_SIGNUP_FAIL,
    FREELANCER_SIGNUP_RESET,
    CLIENT_SIGNUP_REQUEST,
    CLIENT_SIGNUP_SUCCESS,
    CLIENT_SIGNUP_FAIL,
    CLIENT_SIGNUP_RESET,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_RESET,
    USER_LOGOUT
  } from '../constants/authConstants';
  
  // Initial state for freelancer signup
  const initialFreelancerSignupState = {
    loading: false,
    success: false,
    error: null,
  };
  
  // Freelancer signup reducer
  export const freelancerSignupReducer = (state = initialFreelancerSignupState, action) => {
    switch (action.type) {
      case FREELANCER_SIGNUP_REQUEST:
        return { loading: true, success: false, error: null };
      case FREELANCER_SIGNUP_SUCCESS:
        return { loading: false, success: true, error: null };
      case FREELANCER_SIGNUP_FAIL:
        return { loading: false, success: false, error: action.payload };
      case FREELANCER_SIGNUP_RESET:
        return { ...initialFreelancerSignupState };
      default:
        return state;
    }
  };
  
  // Initial state for client signup
  const initialClientSignupState = {
    loading: false,
    success: false,
    error: null,
  };
  
  // Client signup reducer
  export const clientSignupReducer = (state = initialClientSignupState, action) => {
    switch (action.type) {
      case CLIENT_SIGNUP_REQUEST:
        return { loading: true, success: false, error: null };
      case CLIENT_SIGNUP_SUCCESS:
        return { loading: false, success: true, error: null };
      case CLIENT_SIGNUP_FAIL:
        return { loading: false, success: false, error: action.payload };
      case CLIENT_SIGNUP_RESET:
        return { ...initialClientSignupState };
      default:
        return state;
    }
  };
  
  // Initial state for login
  // Initial state for login
  const checkTokenExpiration = () => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    
    if (userInfo && userInfo.exp) {
      const currentTime = Date.now() / 1000;
      if (currentTime > userInfo.exp) {
        localStorage.removeItem('userInfo');
        return null;
      }
    }
    return userInfo;
  };
  
  const initialState = {
    userInfo: null,
    loading: false,
    error: null,
  };
  
  export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return { ...state, loading: true };
      case USER_LOGIN_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_LOGIN_FAIL:
        return { ...state, loading: false, error: action.payload };
      case USER_LOGOUT:
        return initialState;
      default:
        return state;
    }
  };