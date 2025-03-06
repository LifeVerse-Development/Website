import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getStoredAuthState = (): { isAuthenticated: boolean; user: { id: string; role: string; profilePicture: string; username: string; fullName: string; email: string } | null } => {
    if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('authState');
        if (storedAuth) {
            return JSON.parse(storedAuth);
        }
    }
    return { isAuthenticated: false, user: null };
};

interface AuthState {
    isAuthenticated: boolean;
    user: { id: string; role: string; profilePicture: string; username: string; fullName: string; email: string } | null;
}

const initialState: AuthState = getStoredAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ id: string; role: string; profilePicture: string; username: string; fullName: string; email: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem('authState', JSON.stringify({ isAuthenticated: true, user: action.payload }));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('authState');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
