import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem("token", token); // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Clear from localStorage
      localStorage.removeItem("user");
    },
    checkTokenExpiration: (state) => {
      const token = state.token || localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        const now = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < now) {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    },
  },
});

export const { loginSuccess, logout, checkTokenExpiration } = authSlice.actions;

export default authSlice.reducer;
