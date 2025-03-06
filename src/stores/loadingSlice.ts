import { createSlice } from '@reduxjs/toolkit';

const getStoredLoadingState = (): boolean => {
    if (typeof window !== 'undefined') {
        const storedLoading = localStorage.getItem('isLoading');
        if (storedLoading) {
            return storedLoading === 'true';
        }
    }
    return false;
};

interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: getStoredLoadingState(),
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            localStorage.setItem('isLoading', 'true');
        },
        stopLoading: (state) => {
            state.isLoading = false;
            localStorage.setItem('isLoading', 'false');
        },
    },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
