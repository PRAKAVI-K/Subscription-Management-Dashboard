import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    currentSubscription: null,
    plans: [],
    loading: false,
  },
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export const { setPlans, setCurrentSubscription, setLoading } =
  subscriptionSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    subscription: subscriptionSlice.reducer,
  },
});
