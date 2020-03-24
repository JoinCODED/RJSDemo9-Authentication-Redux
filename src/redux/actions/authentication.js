import decode from "jwt-decode";

import instance from "./instance";

import { SET_CURRENT_USER } from "./actionTypes";

const setCurrentUser = token => {
  setAuthToken(token);

  const user = token ? decode(token) : null;

  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

const setAuthToken = token => {
  if (token) {
    localStorage.setItem("token", token);
    instance.defaults.headers.Authorization = `jwt ${token}`;
  } else {
    delete instance.defaults.headers.Authorization;
    localStorage.removeItem("token");
  }
};

export const login = userData => async dispatch => {
  try {
    const res = await instance.post(`/login/`, userData);
    const { token } = res.data;
    dispatch(setCurrentUser(token));
  } catch (error) {
    console.error(error);
  }
};

export const signup = userData => async dispatch => {
  try {
    const res = await instance.post(`/signup/`, userData);
    const { token } = res.data;
    dispatch(setCurrentUser(token));
  } catch (error) {
    console.error(error);
  }
};

export const logout = () => setCurrentUser();

export const checkForExpiredToken = () => {
  // Get the token from local storage
  const token = localStorage.getItem("token");

  if (token) {
    const currentTimeInSeconds = Date.now() / 1000;

    // Decode token and get user info
    const user = decode(token);

    // Check token expiration
    if (user.exp >= currentTimeInSeconds) {
      // Set user
      return setCurrentUser(token);
    }
  }

  return setCurrentUser();
};
