import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type ThemeType = 'light' | 'dark';

interface ThemeState {
    theme: ThemeType;
}

const getStoredTheme = (): ThemeType => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    return 'light';
};

export const fetchUserTheme = createAsyncThunk<
    ThemeType,
    { userId: string; accessToken: string; csrfToken: string }
>(
    'theme/fetchUserTheme',
    async ({ userId, accessToken, csrfToken }) => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${userId}/settings/preferences`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    csrfToken: csrfToken || '',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch theme');

            const data = await response.json();
            return ['light', 'dark'].includes(data.theme) ? data.theme : 'light';
        } catch (error) {
            console.error('Error fetching theme:', error);
            return getStoredTheme();
        }
    }
);

export const updateUserTheme = createAsyncThunk<
    ThemeType,
    { userId: string; accessToken: string; csrfToken: string; theme: ThemeType }
>(
    'theme/updateUserTheme',
    async ({ userId, accessToken, csrfToken, theme }) => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${userId}/settings/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    csrfToken: csrfToken || '',
                },
                body: JSON.stringify({ theme }),
            });

            if (!response.ok) throw new Error('Failed to update theme');

            return theme;
        } catch (error) {
            console.error('Error updating theme:', error);
            return getStoredTheme();
        }
    }
);

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
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTheme.fulfilled, (state, action) => {
                state.theme = action.payload;
                localStorage.setItem('theme', action.payload);
            })
            .addCase(updateUserTheme.fulfilled, (state, action) => {
                state.theme = action.payload;
                localStorage.setItem('theme', action.payload);
            });
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
