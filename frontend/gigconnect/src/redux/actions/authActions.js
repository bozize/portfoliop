// src/redux/actions/authActions.js
import axios from 'axios';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  CLIENT_SIGNUP_REQUEST,
  CLIENT_SIGNUP_SUCCESS,
  CLIENT_SIGNUP_FAIL,
  FREELANCER_SIGNUP_REQUEST,
  FREELANCER_SIGNUP_SUCCESS,
  FREELANCER_SIGNUP_FAIL,
} from '../constants/authConstants';

// User Login Action
export const userLogin = (credentials) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/auth/login/',
        credentials,
        config
      );
  
      console.log('API Response:', data); // Debugging line
  
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data, // Passes the entire data object to the reducer
      });
  
      // Save tokens to localStorage
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userRole', data.role);
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
  
// Freelancer Signup Action
export const freelancerSignup = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: FREELANCER_SIGNUP_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      'http://127.0.0.1:8000/api/auth/signup/freelancer/',
      credentials,
      config
    );

    dispatch({
      type: FREELANCER_SIGNUP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FREELANCER_SIGNUP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const clientSignup = (credentials) => async (dispatch) => {
    try {
      dispatch({ type: CLIENT_SIGNUP_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/auth/signup/client/',
        credentials,
        config
      );
  
      dispatch({
        type: CLIENT_SIGNUP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CLIENT_SIGNUP_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };