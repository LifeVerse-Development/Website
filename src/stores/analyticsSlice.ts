import { createSlice } from '@reduxjs/toolkit';

const getStoredPageViews = (): number => {
    if (typeof window !== 'undefined') {
        const storedPageViews = localStorage.getItem('pageViews');
        if (storedPageViews) {
            return parseInt(storedPageViews, 10);
        }
    }
    return 0;
};

interface AnalyticsState {
    pageViews: number;
}

const initialState: AnalyticsState = {
    pageViews: getStoredPageViews(),
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        incrementPageViews: (state) => {
            state.pageViews += 1;
            localStorage.setItem('pageViews', state.pageViews.toString());
        },
    },
});

export const { incrementPageViews } = analyticsSlice.actions;

export default analyticsSlice.reducer;
