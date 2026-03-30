import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const user = JSON.parse(localStorage.getItem('user'));
const profile = JSON.parse(localStorage.getItem('profile'));
const token = localStorage.getItem('token');

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', userData);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.profile) localStorage.setItem('profile', JSON.stringify(data.data.profile));
        return data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.profile) localStorage.setItem('profile', JSON.stringify(data.data.profile));
        return data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const googleAuth = createAsyncThunk('auth/googleAuth', async (googleData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/google', googleData);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (data.data.profile) localStorage.setItem('profile', JSON.stringify(data.data.profile));
        return data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Google Auth failed'); }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/profile');
        return data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to get profile'); }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: user || null, token: token || null, profile: profile || null, loading: false, error: null },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('profile');
            state.user = null; state.token = null; state.profile = null;
        },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.profile = a.payload.profile; s.token = a.payload.token; })
            .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.profile = a.payload.profile; s.token = a.payload.token; })
            .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(googleAuth.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(googleAuth.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.profile = a.payload.profile; s.token = a.payload.token; })
            .addCase(googleAuth.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(getProfile.fulfilled, (s, a) => { s.profile = a.payload; });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
