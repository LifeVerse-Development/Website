import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredQuery = (): string => {
    if (typeof window !== 'undefined') {
        const storedQuery = localStorage.getItem('searchQuery');
        if (storedQuery) {
            return storedQuery;
        }
    }
    return '';
};

interface SearchState {
    query: string;
}

const initialState: SearchState = {
    query: getStoredQuery(),
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            localStorage.setItem('searchQuery', action.payload);
        },
        clearQuery: (state) => {
            state.query = '';
            localStorage.removeItem('searchQuery');
        },
    },
});

export const { setQuery, clearQuery } = searchSlice.actions;

export default searchSlice.reducer;
