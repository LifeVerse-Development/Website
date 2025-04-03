import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"

const getStoredAuthState = () => {
    if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("authState")
        if (storedAuth) {
            try {
                return JSON.parse(storedAuth)
            } catch (e) {
                console.error("Failed to parse stored auth state:", e)
                return { isAuthenticated: false, user: null, csrfToken: "csrfToken", twoFactorVerified: false }
            }
        }
    }
    return { isAuthenticated: false, user: null, csrfToken: "csrfToken", twoFactorVerified: false }
}

interface Post {
    identifier: string
    image?: string
    title?: string
    description?: string
    content: string
    tags: string[]
    badges: string[]
    author: string
    createdAt: Date
    updatedAt: Date
}

interface Address {
    street?: string
    houseNumber?: string
    apartment?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
}

interface Verification {
    verified: boolean
    code: string
}

interface AuthenticatorSetup {
    isEnabled: boolean
    qrCode: string
    secret: string
    verificationCode: string
    recoveryCodesGenerated: boolean
    recoveryCodes: string[]
}

interface PrivacySettings {
    visibility: "public" | "followers" | "private"
    showOnlineState: boolean
    showActivity: boolean
}

interface User {
    identifier: string
    userId: string
    socketId?: string
    accessToken: string
    refreshToken: string
    titlePicture?: string
    profilePicture?: string
    email?: string
    username: string
    role: string
    firstName?: string
    middleName?: string
    lastName?: string
    password?: string
    bio?: string
    address?: Address
    phoneNumber?: string
    payments?: string[]
    chats?: string[]
    groups?: string[]
    follower?: string[]
    following?: string[]
    posts?: Post[]
    apiKeys?: string[]
    stripeCustomerId?: string
    betaKey?: string
    twoFactorEnabled?: boolean
    privacySettings?: PrivacySettings
    emailNotification?: boolean
    pushNotification?: boolean
    language?: string
    theme?: "light" | "dark"
    verification?: {
        email: Verification
        discord: Verification
        sms: Verification
    }
    authenticatorSetup?: AuthenticatorSetup
    createdAt: Date
    updatedAt: Date
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    csrfToken: string
    twoFactorVerified: boolean
    loading?: boolean
    error?: string | null
}

// Define the payload type for the verifyTwoFactorAuth action
interface TwoFactorAuthPayload {
    user?: Partial<User>
    token?: string
    csrfToken?: string
}

const initialState: AuthState = {
    ...getStoredAuthState(),
    twoFactorVerified: false,
    loading: false,
    error: null,
}

// Add this action for 2FA verification with proper typing
export const verifyTwoFactorAuth = createAsyncThunk<
    TwoFactorAuthPayload, // Return type
    TwoFactorAuthPayload, // Argument type
    {
        rejectValue: string
    }
>("auth/verifyTwoFactorAuth", async (data, { rejectWithValue }) => {
    try {
        return data
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Verification failed")
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; csrfToken: string }>) => {
            state.isAuthenticated = true
            state.user = action.payload.user
            state.csrfToken = action.payload.csrfToken
            localStorage.setItem(
                "authState",
                JSON.stringify({
                    isAuthenticated: true,
                    user: action.payload.user,
                    csrfToken: action.payload.csrfToken,
                    twoFactorVerified: state.twoFactorVerified,
                }),
            )
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.csrfToken = ""
            state.twoFactorVerified = false
            localStorage.removeItem("authState")
        },
    },
    extraReducers: (builder) => {
        // Add these cases for 2FA verification
        builder.addCase(verifyTwoFactorAuth.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(verifyTwoFactorAuth.fulfilled, (state, action) => {
            state.loading = false
            state.twoFactorVerified = true

            // Update user or token information if provided
            if (action.payload.user && state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload.user,
                }
            }
            if (action.payload.token && state.user) {
                state.user.accessToken = action.payload.token
            }

            // Update localStorage
            localStorage.setItem(
                "authState",
                JSON.stringify({
                    isAuthenticated: state.isAuthenticated,
                    user: state.user,
                    csrfToken: state.csrfToken,
                    twoFactorVerified: true,
                }),
            )
        })
        builder.addCase(verifyTwoFactorAuth.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

