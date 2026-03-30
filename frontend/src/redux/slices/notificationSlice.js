import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/notifications?limit=50');
        return data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
    }
});

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/notifications/${id}`);
        return data.data; // returns single notification object
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
    }
});

export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, { rejectWithValue }) => {
    try {
        await api.put('/notifications/read-all');
        return true;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read');
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
            state.total = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch multiple
            .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
                state.total = action.payload.total;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark Single Read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const updatedNotification = action.payload;
                const index = state.items.findIndex(n => n._id === updatedNotification._id);
                if (index !== -1 && !state.items[index].isRead) {
                    state.items[index].isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Mark all read
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.items.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
