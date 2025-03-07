import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getStoredAuthState = () => {
    if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("authState");
        if (storedAuth) {
            return JSON.parse(storedAuth);
        }
    }
    return { isAuthenticated: false, user: null };
};

interface User {
    identifier: string;
    userId: string;
    socketId: string;
    accessToken: string;
    refreshToken: string;
    titlePicture?: string;
    profilePicture?: string;
    email?: string;
    username: string;
    role: string;
    bio?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address?: {
        street: string;
        houseNumber: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    payments?: string[];
    chats?: string[];
    groups?: string[];
    follower?: string[]; 
    following?: string[]; 
    posts?: string[];
    apiKeys?: string[];
    betaKey?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = getStoredAuthState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem(
                "authState",
                JSON.stringify({ isAuthenticated: true, user: action.payload })
            );
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("authState");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
