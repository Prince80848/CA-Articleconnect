import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyApplications = createAsyncThunk('applications/fetchMy', async (_, { rejectWithValue }) => {
    try { const { data } = await api.get('/applications'); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const applyToJob = createAsyncThunk('applications/apply', async (appData, { rejectWithValue }) => {
    try { const { data } = await api.post('/applications', appData); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to apply'); }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, ...updates }, { rejectWithValue }) => {
    try { const { data } = await api.put(`/applications/${id}`, updates); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const applicationSlice = createSlice({
    name: 'applications',
    initialState: { applications: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyApplications.pending, (s) => { s.loading = true; })
            .addCase(fetchMyApplications.fulfilled, (s, a) => { s.loading = false; s.applications = a.payload; })
            .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(applyToJob.fulfilled, (s, a) => { s.applications.unshift(a.payload); })
            .addCase(updateApplicationStatus.fulfilled, (s, a) => {
                const idx = s.applications.findIndex(app => app._id === a.payload._id);
                if (idx !== -1) s.applications[idx] = a.payload;
            });
    }
});

export default applicationSlice.reducer;
