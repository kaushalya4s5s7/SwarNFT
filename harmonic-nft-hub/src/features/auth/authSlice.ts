
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserRole } from '@/types';

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  hasSelectedRole: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
      state.hasSelectedRole = true;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  setRole,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
