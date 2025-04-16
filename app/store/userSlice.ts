// store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { AxiosError } from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

// Get user data from localStorage
const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userJSON = localStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('/api/auth', userData);  // Ensure this matches your backend route
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('/api/auth/login', userData); // ✅ FIXED!
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: unknown) {
      let message = 'Something went wrong';
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetAuthState } = userSlice.actions;
export default userSlice.reducer;