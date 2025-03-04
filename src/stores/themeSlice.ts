import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark' ? 'dark' : 'light';
        }
    }
    return 'light';
};

interface ThemeState {
    theme: 'light' | 'dark';
}

const initialState: ThemeState = {
    theme: getStoredTheme(), 
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
