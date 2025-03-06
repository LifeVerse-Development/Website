import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredError = (): string | null => {
    if (typeof window !== 'undefined') {
        const storedError = localStorage.getItem('errorMessage');
        if (storedError) {
            return storedError;
        }
    }
    return null;
};

interface ErrorState {
    message: string | null;
}

const initialState: ErrorState = {
    message: getStoredError(),
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
            localStorage.setItem('errorMessage', action.payload);
        },
        clearError: (state) => {
            state.message = null;
            localStorage.removeItem('errorMessage');
        },
    },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
