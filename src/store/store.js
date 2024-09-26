import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/features/auth/authSlice";

const checkAuthMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    const decodedToken = jwt_decode(token);
    const now = Date.now() / 1000;
    if (decodedToken.exp < now) {
      store.dispatch(logout());
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkAuthMiddleware),
});
