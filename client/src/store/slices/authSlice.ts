import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getStoredAuth = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
  } catch (error) {
    console.error("Failed to load auth:", error);
  }

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          accessToken: action.payload.accessToken,
          isAuthenticated: true,
        }),
      );
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
