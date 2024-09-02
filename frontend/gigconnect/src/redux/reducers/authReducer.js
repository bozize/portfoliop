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
  const initialState = {
    loading: false,
    userInfo: null,
    error: null,
    success: false,
  };
  
  export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return {
          ...state, 
          loading: true,
          error: null, // Reset any previous error
        };
      case USER_LOGIN_SUCCESS:
        console.log('Login success:', action.payload); // Debugging line
        return {
          loading: false,
          userInfo: action.payload, // Store the entire userInfo object
          success: true, // Set success to true
          error: null,
        };
      case USER_LOGIN_FAIL:
        console.error('Login error:', action.payload); // Debugging line
        return {
          ...state,
          loading: false,
          error: action.payload,
          success: false, // Ensure success is false
        };
      case USER_LOGIN_RESET:
        return initialState;
      default:
        return state;
    }
  };
  