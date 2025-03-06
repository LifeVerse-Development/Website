import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredPreferences = (): { language: string; currency: string } => {
    if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('language');
        const storedCurrency = localStorage.getItem('currency');

        return {
            language: storedLanguage ? storedLanguage : 'de',
            currency: storedCurrency ? storedCurrency : 'EUR',
        };
    }
    return { language: 'de', currency: 'EUR' };
};

interface PreferencesState {
    language: string;
    currency: string;
}

const initialState: PreferencesState = getStoredPreferences();

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
            localStorage.setItem('language', action.payload);
        },
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
            localStorage.setItem('currency', action.payload);
        },
    },
});

export const { setLanguage, setCurrency } = preferencesSlice.actions;

export default preferencesSlice.reducer;
