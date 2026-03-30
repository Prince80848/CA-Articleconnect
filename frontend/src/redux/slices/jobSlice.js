import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/jobs', { params });
        return data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs'); }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
    try { const { data } = await api.get(`/jobs/${id}`); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createJob = createAsyncThunk('jobs/createJob', async (jobData, { rejectWithValue }) => {
    try { const { data } = await api.post('/jobs', jobData); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyJobs = createAsyncThunk('jobs/fetchMyJobs', async (_, { rejectWithValue }) => {
    try { const { data } = await api.get('/jobs/my-jobs'); return data.data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const jobSlice = createSlice({
    name: 'jobs',
    initialState: { jobs: [], currentJob: null, myJobs: [], total: 0, pages: 0, loading: false, error: null },
    reducers: { clearCurrentJob: (s) => { s.currentJob = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (s) => { s.loading = true; })
            .addCase(fetchJobs.fulfilled, (s, a) => { s.loading = false; s.jobs = a.payload.jobs; s.total = a.payload.total; s.pages = a.payload.pages; })
            .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(fetchJobById.fulfilled, (s, a) => { s.currentJob = a.payload; })
            .addCase(createJob.fulfilled, (s, a) => { s.myJobs.unshift(a.payload); })
            .addCase(fetchMyJobs.fulfilled, (s, a) => { s.myJobs = a.payload; });
    }
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
