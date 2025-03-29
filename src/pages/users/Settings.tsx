"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import LazyLoading from "../../components/LazyLoading"
import { Save, Lock, User, Bell, Shield, Globe, Trash2, AlertTriangle, CheckCircle, X, LogOut } from "lucide-react"
import { login } from "../../stores/authSlice"

interface SettingsState {
  email: string
  username: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  language: string
  theme: string
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorAuth: boolean
  privacySettings: {
    profileVisibility: "public" | "followers" | "private"
    showOnlineStatus: boolean
    showActivity: boolean
  }
  // Add verification fields
  discordVerification: {
    verified: boolean
    code: string
  }
  emailVerification: {
    verified: boolean
    code: string
  }
  smsVerification: {
    verified: boolean
    code: string
  }
  // Add expanded user fields
  firstName: string
  middleName: string
  lastName: string
  bio: string
  address: {
    street: string
    houseNumber: string
    apartment: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  phoneNumber: string
  titlePicture: string
  profilePicture: string
  // Add to SettingsState interface
  authenticatorSetup: {
    isEnabled: boolean
    qrCode: string
    secret: string
    verificationCode: string
    recoveryCodesGenerated: boolean
    recoveryCodes: string[]
    otpauthUrl?: string
  }
}

const Settings: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, csrfToken } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("account")
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [settings, setSettings] = useState<SettingsState>({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "en",
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    privacySettings: {
      profileVisibility: "public",
      showOnlineStatus: true,
      showActivity: true,
    },
    // Add verification fields
    discordVerification: {
      verified: false,
      code: "",
    },
    emailVerification: {
      verified: false,
      code: "",
    },
    smsVerification: {
      verified: false,
      code: "",
    },
    // Add expanded user fields
    firstName: "",
    middleName: "",
    lastName: "",
    bio: "",
    address: {
      street: "",
      houseNumber: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    phoneNumber: "",
    titlePicture: "",
    profilePicture: "",
    // Add to the settings state initialization
    authenticatorSetup: {
      isEnabled: false,
      qrCode: "",
      secret: "",
      verificationCode: "",
      recoveryCodesGenerated: false,
      recoveryCodes: [],
    },
  })

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setLoading(false)
      return
    }

    // Initialize settings with user data
    setSettings((prev) => ({
      ...prev,
      email: user.email || "",
      username: user.username || "",
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      address: user.address || {
        street: "",
        houseNumber: "",
        apartment: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
      phoneNumber: user.phoneNumber || "",
      titlePicture: user.titlePicture || "",
      profilePicture: user.profilePicture || "",
    }))

    // Check for stored notification in localStorage
    const storedNotification = localStorage.getItem("settingsNotification")
    if (storedNotification) {
      try {
        const parsedNotification = JSON.parse(storedNotification)
        setNotification(parsedNotification)

        // Clear the notification from localStorage
        localStorage.removeItem("settingsNotification")

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ type: null, message: "" })
        }, 5000)
      } catch (error) {
        console.error("Error parsing stored notification:", error)
      }
    }

    // Simulate loading user settings
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>
          <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 text-center">
              Authentication Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
              Please log in to access your account settings.
            </p>
            <a
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Go to Login
            </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LazyLoading />
        </div>
        <Footer />
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setSettings((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setSettings((prev) => ({
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          [name]: checked,
        },
      }))
    } else {
      setSettings((prev) => ({
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          [name]: value,
        },
      }))
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  const handleVerificationChange = (type: "discord" | "email" | "sms", value: string) => {
    setSettings((prev) => ({
      ...prev,
      [`${type}Verification`]: {
        ...(prev[`${type}Verification` as keyof typeof prev] as any),
        code: value,
      },
    }))
  }

  const handleVerify = async (type: "discord" | "email" | "sms") => {
    setSaving(true)
    try {
      const code = settings[`${type}Verification`].code

      const response = await fetch(`http://localhost:3001/api/auth/verify/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
          code: code,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to verify ${type}`)
      }

      // Update verification status
      setSettings((prev) => ({
        ...prev,
        [`${type}Verification`]: {
          ...(prev[`${type}Verification` as keyof typeof prev] as any),
          verified: true,
        },
      }))

      // Store notification in localStorage for after reload
      localStorage.setItem(
        "settingsNotification",
        JSON.stringify({
          type: "success",
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} verification successful!`,
        }),
      )

      // Reload the page
      window.location.reload()
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : `Failed to verify ${type}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const setupAuthenticator = async () => {
    setSaving(true)
    try {
      // Make API call to generate TOTP secret and QR code
      const response = await fetch("http://localhost:3001/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
          email: user?.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to setup authenticator")
      }

      const data = await response.json()

      // Set the QR code and secret from the API response
      setSettings((prev) => ({
        ...prev,
        authenticatorSetup: {
          ...prev.authenticatorSetup,
          qrCode: data.qrCodeUrl,
          secret: data.secret,
          otpauthUrl: data.otpauthUrl,
        },
      }))

      setNotification({
        type: "success",
        message: "Authenticator setup initiated. Scan the QR code with your authenticator app.",
      })
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to setup authenticator",
      })
    } finally {
      setSaving(false)
    }
  }

  const verifyAuthenticator = async () => {
    setSaving(true)
    try {
      if (settings.authenticatorSetup.verificationCode.length !== 6) {
        throw new Error("Verification code must be 6 digits")
      }

      // Make API call to verify the code and enable 2FA
      const response = await fetch("http://localhost:3001/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
          code: settings.authenticatorSetup.verificationCode,
          secret: settings.authenticatorSetup.secret,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Invalid verification code")
      }

      // Update local state
      setSettings((prev) => ({
        ...prev,
        authenticatorSetup: {
          ...prev.authenticatorSetup,
          isEnabled: true,
        },
        twoFactorAuth: true,
      }))

      // Update both Redux store and localStorage before reload
      if (user) {
        const updatedUser = {
          ...user,
          twoFactorEnabled: true,
        }

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Update Redux store via dispatch
        dispatch(
          login({
            user: updatedUser,
            csrfToken: csrfToken || "",
          }),
        )

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Two-factor authentication enabled successfully!",
          }),
        )

        // Reload the page to reflect changes
        window.location.reload()
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to verify code",
      })
    } finally {
      setSaving(false)
    }
  }

  const generateRecoveryCodes = async () => {
    setSaving(true)
    try {
      // Make API call to generate recovery codes
      const response = await fetch("http://localhost:3001/api/auth/2fa/recovery-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate recovery codes")
      }

      const data = await response.json()

      setSettings((prev) => ({
        ...prev,
        authenticatorSetup: {
          ...prev.authenticatorSetup,
          recoveryCodesGenerated: true,
          recoveryCodes: data.recoveryCodes,
        },
      }))

      // Store notification in localStorage for after reload
      localStorage.setItem(
        "settingsNotification",
        JSON.stringify({
          type: "success",
          message: "Recovery codes generated. Save these codes in a safe place!",
        }),
      )

      // Reload the page
      window.location.reload()
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to generate recovery codes",
      })
    } finally {
      setSaving(false)
    }
  }

  const disableAuthenticator = async () => {
    setSaving(true)
    try {
      // Make API call to disable 2FA
      const response = await fetch("http://localhost:3001/api/auth/2fa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to disable two-factor authentication")
      }

      // Update local state
      setSettings((prev) => ({
        ...prev,
        authenticatorSetup: {
          isEnabled: false,
          qrCode: "",
          secret: "",
          verificationCode: "",
          recoveryCodesGenerated: false,
          recoveryCodes: [],
        },
        twoFactorAuth: false,
      }))

      // Update both Redux store and localStorage before reload
      if (user) {
        const updatedUser = {
          ...user,
          twoFactorEnabled: false,
        }

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Update Redux store via dispatch
        dispatch(
          login({
            user: updatedUser,
            csrfToken: csrfToken || "",
          }),
        )

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Two-factor authentication disabled",
          }),
        )

        // Reload the page to reflect changes
        window.location.reload()
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to disable two-factor authentication",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAuthenticatorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
    setSettings((prev) => ({
      ...prev,
      authenticatorSetup: {
        ...prev.authenticatorSetup,
        verificationCode: value,
      },
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)

    try {
      // Password validation
      if (activeTab === "security" && settings.newPassword) {
        if (!settings.currentPassword) {
          throw new Error("Current password is required")
        }

        if (settings.newPassword !== settings.confirmPassword) {
          throw new Error("New passwords don't match")
        }

        if (settings.newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters")
        }

        // Update password
        const passwordResponse = await fetch("http://localhost:3001/api/users/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken || "",
          },
          body: JSON.stringify({
            userId: user?.userId,
            currentPassword: settings.currentPassword,
            newPassword: settings.newPassword,
          }),
        })

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json()
          throw new Error(errorData.message || "Failed to update password")
        }

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Password updated successfully!",
          }),
        )

        // Clear passwords
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))

        // Reload the page
        window.location.reload()
        return
      }

      // Update user in localStorage if account info changed
      if (activeTab === "account") {
        // Make API call to update user profile
        const profileResponse = await fetch(`http://localhost:3001/api/users/${user?.userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken || "",
          },
          body: JSON.stringify({
            username: settings.username,
            email: settings.email,
            firstName: settings.firstName,
            middleName: settings.middleName,
            lastName: settings.lastName,
            bio: settings.bio,
            address: settings.address,
            phoneNumber: settings.phoneNumber,
            titlePicture: settings.titlePicture,
            profilePicture: settings.profilePicture,
          }),
        })

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json()
          throw new Error(errorData.message || "Failed to update profile")
        }

        const updatedUserData = await profileResponse.json()

        // Make sure all required fields from User interface are provided as non-undefined values
        if (user) {
          const updatedUser = {
            identifier: user.identifier || "",
            socketId: user.socketId || "",
            accessToken: user.accessToken || "",
            refreshToken: user.refreshToken || "",
            userId: user.userId || "",
            username: updatedUserData.username || settings.username,
            email: updatedUserData.email || settings.email,
            role: user.role || "",
            titlePicture: updatedUserData.titlePicture || settings.titlePicture,
            profilePicture: updatedUserData.profilePicture || settings.profilePicture,
            bio: updatedUserData.bio || settings.bio,
            firstName: updatedUserData.firstName || settings.firstName,
            middleName: updatedUserData.middleName || settings.middleName,
            lastName: updatedUserData.lastName || settings.lastName,
            address: updatedUserData.address || settings.address,
            phoneNumber: updatedUserData.phoneNumber || settings.phoneNumber,
            follower: user.follower || [],
            following: user.following || [],
            posts: user.posts || [],
            twoFactorEnabled: user.twoFactorEnabled || false,
            createdAt: user.createdAt || new Date(),
            updatedAt: new Date(),
          }

          // Update both Redux store and localStorage before reload
          localStorage.setItem("user", JSON.stringify(updatedUser))

          // Update Redux store via dispatch
          dispatch(
            login({
              user: updatedUser,
              csrfToken: csrfToken || "",
            }),
          )

          // Store notification in localStorage for after reload
          localStorage.setItem(
            "settingsNotification",
            JSON.stringify({
              type: "success",
              message: "Account information updated successfully!",
            }),
          )

          // Reload the page to reflect changes
          window.location.reload()
          return
        }
      }

      // Update privacy settings
      if (activeTab === "privacy") {
        const privacyResponse = await fetch(`http://localhost:3001/api/users/${user?.userId}/privacy`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken || "",
          },
          body: JSON.stringify({
            privacySettings: settings.privacySettings,
          }),
        })

        if (!privacyResponse.ok) {
          const errorData = await privacyResponse.json()
          throw new Error(errorData.message || "Failed to update privacy settings")
        }

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Privacy settings updated successfully!",
          }),
        )

        // Reload the page
        window.location.reload()
        return
      }

      // Update notification settings
      if (activeTab === "notifications") {
        const notificationResponse = await fetch(`http://localhost:3001/api/users/${user?.userId}/notifications`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken || "",
          },
          body: JSON.stringify({
            emailNotifications: settings.emailNotifications,
            pushNotifications: settings.pushNotifications,
          }),
        })

        if (!notificationResponse.ok) {
          const errorData = await notificationResponse.json()
          throw new Error(errorData.message || "Failed to update notification settings")
        }

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Notification preferences updated successfully!",
          }),
        )

        // Reload the page
        window.location.reload()
        return
      }

      // Update preferences
      if (activeTab === "preferences") {
        const preferencesResponse = await fetch(`http://localhost:3001/api/users/${user?.userId}/preferences`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken || "",
          },
          body: JSON.stringify({
            language: settings.language,
            theme: settings.theme,
          }),
        })

        if (!preferencesResponse.ok) {
          const errorData = await preferencesResponse.json()
          throw new Error(errorData.message || "Failed to update preferences")
        }

        // Store notification in localStorage for after reload
        localStorage.setItem(
          "settingsNotification",
          JSON.stringify({
            type: "success",
            message: "Preferences updated successfully!",
          }),
        )

        // Reload the page
        window.location.reload()
        return
      }

      // If we get here, show notification directly (should not happen with the above returns)
      setNotification({
        type: "success",
        message: "Settings saved successfully!",
      })
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save settings",
      })
    } finally {
      setSaving(false)

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ type: null, message: "" })
      }, 5000)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.username) {
      setNotification({
        type: "error",
        message: "Username doesn't match",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/users/${user?.userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete account")
      }

      // Redirect to logout
      navigate("/logout")
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete account",
      })
    } finally {
      setShowDeleteModal(false)
      setDeleteConfirmation("")
    }
  }

  const copyRecoveryCode = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        setNotification({
          type: "success",
          message: "Recovery code copied to clipboard",
        })

        // Auto-hide notification after 2 seconds
        setTimeout(() => {
          setNotification({ type: null, message: "" })
        }, 2000)
      },
      () => {
        setNotification({
          type: "error",
          message: "Failed to copy code",
        })
      },
    )
  }

  const logoutEverywhere = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
          csrfToken: csrfToken || "",
        },
        body: JSON.stringify({
          userId: user?.userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to log out from all devices")
      }

      // Store notification in localStorage for after reload
      localStorage.setItem(
        "settingsNotification",
        JSON.stringify({
          type: "success",
          message: "Logged out from all other devices",
        }),
      )

      // Reload the page
      window.location.reload()
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to log out from all devices",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section with Blob */}
      <div className="relative overflow-hidden pt-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        {/* Settings Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden sticky top-24">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("account")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "account"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span>Account</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Lock className="mr-3 h-5 w-5" />
                    <span>Security</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("verification")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "verification"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    <span>Verification</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Bell className="mr-3 h-5 w-5" />
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("privacy")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "privacy"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    <span>Privacy</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "preferences"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Globe className="mr-3 h-5 w-5" />
                    <span>Preferences</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("danger")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === "danger"
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <AlertTriangle className="mr-3 h-5 w-5" />
                    <span>Danger Zone</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                {/* Account Settings */}
                {activeTab === "account" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>

                    {/* Basic Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={settings.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={settings.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="middleName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Middle Name
                          </label>
                          <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={settings.middleName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={settings.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="bio"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={settings.bio}
                          onChange={(e) => setSettings((prev) => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={settings.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Street
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            value={settings.address.street}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="houseNumber"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              House Number
                            </label>
                            <input
                              type="text"
                              id="houseNumber"
                              name="houseNumber"
                              value={settings.address.houseNumber}
                              onChange={handleAddressChange}
                              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="apartment"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Apartment
                            </label>
                            <input
                              type="text"
                              id="apartment"
                              name="apartment"
                              value={settings.address.apartment}
                              onChange={handleAddressChange}
                              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={settings.address.city}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={settings.address.state}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={settings.address.country}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={settings.address.postalCode}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Profile Pictures */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Pictures</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="profilePicture"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Profile Picture
                          </label>
                          <div className="mt-1 flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {settings.profilePicture ? (
                                <img
                                  src={settings.profilePicture || "/placeholder.svg"}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="titlePicture"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Title Picture
                          </label>
                          <div className="mt-1 flex items-center space-x-4">
                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {settings.titlePicture ? (
                                <img
                                  src={settings.titlePicture || "/placeholder.svg"}
                                  alt="Title"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-400 text-xs">No image</div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>

                    {/* Password Section */}
                    <div className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Current Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={settings.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            New Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={settings.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Confirm New Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={settings.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            id="showPassword"
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Show password
                          </label>
                        </div>

                        <div>
                          <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {saving ? "Saving..." : "Update Password"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Authentication Section */}
                    <div className="mb-8 p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Add an extra layer of security to your account with authenticator apps
                          </p>
                        </div>
                        {settings.authenticatorSetup.isEnabled ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Disabled
                          </span>
                        )}
                      </div>

                      {!settings.authenticatorSetup.isEnabled ? (
                        <div>
                          {!settings.authenticatorSetup.qrCode ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <Shield className="h-12 w-12 text-blue-500 mb-4" />
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Protect your account
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                                Use an authenticator app like Google Authenticator or Microsoft Authenticator to add an
                                extra layer of security.
                              </p>
                              <button
                                onClick={setupAuthenticator}
                                disabled={saving}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {saving ? "Setting up..." : "Set up two-factor authentication"}
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                                  1. Scan this QR code
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  Use an authenticator app like Google Authenticator or Microsoft Authenticator to scan
                                  this QR code.
                                </p>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                  <div className="bg-white p-4 rounded-lg inline-block">
                                    <img
                                      src={settings.authenticatorSetup.qrCode || "/placeholder.svg"}
                                      alt="QR Code"
                                      className="w-48 h-48"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                      Can't scan the QR code? Enter this code manually in your app:
                                    </p>
                                    <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center text-lg tracking-wider mb-2">
                                      {settings.authenticatorSetup.secret}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Keep this code secret. Anyone with this code can generate valid 2FA codes for your
                                      account.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                                  2. Enter verification code
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  Enter the 6-digit code from your authenticator app to verify setup.
                                </p>
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={settings.authenticatorSetup.verificationCode}
                                    onChange={handleAuthenticatorCodeChange}
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-wider font-mono"
                                    maxLength={6}
                                  />
                                  <button
                                    onClick={verifyAuthenticator}
                                    disabled={settings.authenticatorSetup.verificationCode.length !== 6 || saving}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                  >
                                    {saving ? "Verifying..." : "Verify"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Recovery Codes</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Recovery codes can be used to access your account if you lose your phone or cannot access
                              your authenticator app.
                            </p>

                            {settings.authenticatorSetup.recoveryCodesGenerated ? (
                              <div>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {settings.authenticatorSetup.recoveryCodes.map((code, index) => (
                                      <div
                                        key={index}
                                        className="font-mono text-sm p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        onClick={() => copyRecoveryCode(code)}
                                        title="Click to copy"
                                      >
                                        {code}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-amber-800 dark:text-amber-300 text-sm mb-4">
                                  <strong>Important:</strong> Save these recovery codes in a secure location. Each code
                                  can only be used once. Click on a code to copy it.
                                </div>
                                <button
                                  onClick={generateRecoveryCodes}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Generate new recovery codes
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={generateRecoveryCodes}
                                disabled={saving}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {saving ? "Generating..." : "Generate recovery codes"}
                              </button>
                            )}
                          </div>

                          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                              Disable Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Disabling two-factor authentication will make your account less secure.
                            </p>
                            <button
                              onClick={disableAuthenticator}
                              disabled={saving}
                              className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {saving ? "Disabling..." : "Disable two-factor authentication"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Settings */}
                {activeTab === "verification" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Verification</h2>
                    <div className="space-y-8">
                      {/* Discord Verification */}
                      <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Discord Verification</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Verify your account using Discord's 8-digit code
                            </p>
                          </div>
                          {settings.discordVerification.verified ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              Unverified
                            </span>
                          )}
                        </div>

                        {!settings.discordVerification.verified && (
                          <div className="mt-4">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Enter 8-digit code"
                                value={settings.discordVerification.code}
                                onChange={(e) => handleVerificationChange("discord", e.target.value)}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                maxLength={8}
                              />
                              <button
                                onClick={() => handleVerify("discord")}
                                disabled={settings.discordVerification.code.length !== 8 || saving}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {saving ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Open Discord and find your 8-digit verification code in the connected app
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">Email Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Receive notifications about activity via email
                          </p>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="emailNotifications"
                              checked={settings.emailNotifications}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">Push Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Receive notifications on your device
                          </p>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="pushNotifications"
                              checked={settings.pushNotifications}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="profileVisibility"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Profile Visibility
                        </label>
                        <select
                          id="profileVisibility"
                          name="profileVisibility"
                          value={settings.privacySettings.profileVisibility}
                          onChange={handlePrivacyChange}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="public">Public - Anyone can view</option>
                          <option value="followers">Followers Only</option>
                          <option value="private">Private - Only you</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">Show Online Status</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Let others see when you're online
                          </p>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="showOnlineStatus"
                              checked={settings.privacySettings.showOnlineStatus}
                              onChange={handlePrivacyChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">Show Activity</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Let others see your recent activity
                          </p>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="showActivity"
                              checked={settings.privacySettings.showActivity}
                              onChange={handlePrivacyChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Settings */}
                {activeTab === "preferences" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="language"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Language
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={settings.language}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                          <option value="fr">Français</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="theme"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          value={settings.theme}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <div>
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">Danger Zone</h2>
                    <div className="space-y-6">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h3>
                        <p className="text-red-700 dark:text-red-300 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </button>
                      </div>

                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
                          Log Out Everywhere
                        </h3>
                        <p className="text-amber-700 dark:text-amber-300 mb-4">
                          This will log you out from all devices except this one.
                        </p>
                        <button
                          onClick={logoutEverywhere}
                          className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out Everywhere
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notification */}
            {notification.type && (
              <div
                className={`mt-4 p-4 rounded-xl flex items-start ${
                  notification.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                )}
                <span>{notification.message}</span>
                <button onClick={() => setNotification({ type: null, message: "" })} className="ml-auto">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="h-2 bg-red-500"></div>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Account</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </p>
                      <div className="mt-4">
                        <label
                          htmlFor="confirmDelete"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Please type <span className="font-semibold">{user?.username}</span> to confirm
                        </label>
                        <input
                          type="text"
                          id="confirmDelete"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Settings

