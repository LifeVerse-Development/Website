import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredNotification = (): { message: string | null; type: 'success' | 'warn' | 'info' | 'error' | null } => {
    if (typeof window !== 'undefined') {
        const storedMessage = localStorage.getItem('notificationMessage');
        const storedType = localStorage.getItem('notificationType');

        return {
            message: storedMessage,
            type: storedType as 'success' | 'warn' | 'info' | 'error' | null,
        };
    }
    return { message: null, type: null };
};

interface NotificationState {
    message: string | null;
    type: 'success' | 'warn' | 'info' | 'error' | null;
}

const initialState: NotificationState = getStoredNotification();

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'warn' | 'info' | 'error' }>) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            localStorage.setItem('notificationMessage', action.payload.message);
            localStorage.setItem('notificationType', action.payload.type);
        },
        clearNotification: (state) => {
            state.message = null;
            state.type = null;
            localStorage.removeItem('notificationMessage');
            localStorage.removeItem('notificationType');
        },
    },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
