import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Http from '../../api/Http';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    const response = await Http.get('/auth/me');
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Not authenticated');
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await Http.post('/auth/login', { email, password });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await Http.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Registration failed');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await Http.post('/auth/logout');
    return null;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload as string;
    });

    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    // register
    builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });
  },
});

export default authSlice.reducer;
