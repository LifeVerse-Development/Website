import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getStoredAuthState = () => {
    if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("authState");
        if (storedAuth) {
            return JSON.parse(storedAuth);
        }
    }
    return { isAuthenticated: false, user: null, csrfToken: "csrfToken" };
};

interface Post {
    identifier: string;
    image?: string;
    title?: string;
    description?: string;
    content: string;
    tags: string[];
    badges: string[];
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Address {
    street?: string;
    houseNumber?: string;
    apartment?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

interface Verification {
    verified: boolean;
    code: string;
}

interface AuthenticatorSetup {
    isEnabled: boolean;
    qrCode: string;
    secret: string;
    verificationCode: string;
    recoveryCodesGenerated: boolean;
    recoveryCodes: string[];
}

interface PrivacySettings {
    visibility: "public" | "followers" | "private";
    showOnlineState: boolean;
    showActivity: boolean;
}

interface User {
    identifier: string;
    userId: string;
    socketId?: string;
    accessToken: string;
    refreshToken: string;
    titlePicture?: string;
    profilePicture?: string;
    email?: string;
    username: string;
    role: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    password?: string;
    bio?: string;
    address?: Address;
    phoneNumber?: string;
    payments?: string[];
    chats?: string[];
    groups?: string[];
    follower?: string[];
    following?: string[];
    posts?: Post[];
    apiKeys?: string[];
    stripeCustomerId?: string;
    betaKey?: string;
    twoFactorEnabled?: boolean;
    privacySettings?: PrivacySettings;
    emailNotification?: boolean;
    pushNotification?: boolean;
    language?: string;
    theme?: "light" | "dark";
    verification?: {
        email: Verification;
        discord: Verification;
        sms: Verification;
    };
    authenticatorSetup?: AuthenticatorSetup;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    csrfToken: string;
}

const initialState: AuthState = getStoredAuthState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; csrfToken: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.csrfToken = action.payload.csrfToken;
            localStorage.setItem(
                "authState",
                JSON.stringify({
                    isAuthenticated: true,
                    user: action.payload.user,
                    csrfToken: action.payload.csrfToken,
                })
            );
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.csrfToken = "";
            localStorage.removeItem("authState");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;