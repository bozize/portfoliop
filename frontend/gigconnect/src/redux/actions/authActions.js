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
  USER_LOGOUT
} from '../constants/authConstants';

export const userLogin = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      'http://127.0.0.1:8000/api/login/',
      credentials,
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('userRole', data.role);

  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.detail
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
      'http://127.0.0.1:8000/api/signup/client/',
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

export const freelancerSignup = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: FREELANCER_SIGNUP_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      'http://127.0.0.1:8000/api/signup/freelancer/',
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

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  dispatch({ type: USER_LOGOUT });
};
export const checkAuthStatus = () => (dispatch) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: JSON.parse(userInfo),
    });
  }
};

export const setAuthToken = (token) => (dispatch) => {
  localStorage.setItem('authToken', token);
  // Dispatch action to set auth state in Redux store
  dispatch({ type: 'AUTH_SET_TOKEN', payload: token });
};

export const setCredentials = (data) => (dispatch) => {
  dispatch({
    type: USER_LOGIN_SUCCESS,
    payload: {
      ...data.user,
      token: data.token
    }
  });
};


export const setUserInfo = (userInfo) => (dispatch) => {
  dispatch({
    type: USER_LOGIN_SUCCESS,
    payload: userInfo,
  });
};
