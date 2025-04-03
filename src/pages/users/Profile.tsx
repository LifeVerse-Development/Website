"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { login } from "../../stores/authSlice"
import axios from "axios"
import LazyLoading from "../../components/LazyLoading"
import {
  Edit,
  Camera,
  Users,
  MessageSquare,
  Calendar,
  UserPlus,
  UserMinus,
  Save,
  X,
  Mail,
  Phone,
  DiscIcon as Discord,
  Settings,
  LogOut,
} from "lucide-react"
// Add toast library to package.json
import toast from "react-hot-toast"

// Define interfaces for API responses
// Delete or comment out this interface:
// interface ApiResponse<T> {
//   success: boolean
//   message: string
//   data?: T
// }

interface FollowStats {
  followers: number
  following: number
}

// Use the Post interface from authSlice.ts
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
  likes?: number
  comments?: any[]
}

// Use the Verification interface from authSlice.ts
interface Verification {
  verified: boolean
  code: string
}

// Use the PrivacySettings interface from authSlice.ts
interface PrivacySettings {
  visibility: "public" | "followers" | "private"
  showOnlineState: boolean
  showActivity: boolean
}

// Use the AuthenticatorSetup interface from authSlice.ts
interface AuthenticatorSetup {
  isEnabled: boolean
  qrCode: string
  secret: string
  verificationCode: string
  recoveryCodesGenerated: boolean
  recoveryCodes: string[]
}

// Use the Address interface from authSlice.ts
interface Address {
  street?: string
  houseNumber?: string
  apartment?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

// Use the User interface from authSlice.ts
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

// API base URL
const API_BASE_URL = "http://localhost:3001/api/users"

const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const { username } = useParams<{ username: string }>()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followStats, setFollowStats] = useState<FollowStats>({ followers: 0, following: 0 })
  const [newPostContent, setNewPostContent] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [postTags, setPostTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setLoading(false)
      return
    }

    const isOwnProfile = username === user.username || username === user.userId

    if (isOwnProfile) {
      // Create a properly typed User object
      const userData: User = {
        identifier: user.identifier,
        userId: user.userId,
        socketId: user.socketId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        titlePicture: user.titlePicture,
        profilePicture: user.profilePicture,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        posts: user.posts || [],
        follower: user.follower || [],
        following: user.following || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        twoFactorEnabled: user.twoFactorEnabled || false,
        verification: user.verification,
        privacySettings: user.privacySettings,
        emailNotification: user.emailNotification,
        pushNotification: user.pushNotification,
        language: user.language,
        theme: user.theme,
        address: user.address,
        phoneNumber: user.phoneNumber,
        authenticatorSetup: user.authenticatorSetup,
      }

      setProfileData(userData)
      setIsFollowing(false)

      // Fetch follow stats for own profile
      try {
        const response = await axios.get(`${API_BASE_URL}/${user.userId}/follow-stats`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })

        if (response.data.success) {
          setFollowStats(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching follow stats:", error)
      }

      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/${username}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.data.success) {
        // Create a properly typed User object from the API response
        const fetchedProfileData: User = {
          identifier: response.data.data.identifier,
          userId: response.data.data.userId,
          socketId: response.data.data.socketId,
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
          titlePicture: response.data.data.titlePicture,
          profilePicture: response.data.data.profilePicture,
          email: response.data.data.email,
          username: response.data.data.username,
          role: response.data.data.role,
          bio: response.data.data.bio,
          firstName: response.data.data.firstName,
          middleName: response.data.data.middleName,
          lastName: response.data.data.lastName,
          posts: response.data.data.posts || [],
          follower: response.data.data.follower?.map((f: { userId: string }) => f.userId) || [],
          following: response.data.data.following?.map((f: { userId: string }) => f.userId) || [],
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt,
          twoFactorEnabled: response.data.data.twoFactorEnabled || false,
          verification: response.data.data.verification,
          privacySettings: response.data.data.privacySettings,
          emailNotification: response.data.data.emailNotification,
          pushNotification: response.data.data.pushNotification,
          language: response.data.data.language,
          theme: response.data.data.theme,
          address: response.data.data.address,
          phoneNumber: response.data.data.phoneNumber,
          authenticatorSetup: response.data.data.authenticatorSetup,
        }

        setProfileData(fetchedProfileData)
        setIsFollowing(fetchedProfileData.follower?.includes(user.userId) ?? false)

        // Fetch follow stats
        const statsResponse = await axios.get(`${API_BASE_URL}/${fetchedProfileData.userId}/follow-stats`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })

        if (statsResponse.data.success) {
          setFollowStats(statsResponse.data.data)
        }
      }
    } catch (error) {
      console.error("Error fetching user data: ", error)
      toast.error("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user, username])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

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
              Please log in to view your profile and access all features.
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileData || !user) return

    try {
      setLoading(true)

      // Update user data via API (excluding images which are handled separately)
      const response = await axios.put(
        `${API_BASE_URL}/${user.userId}`,
        {
          username: profileData.username,
          bio: profileData.bio,
          // Remove these lines since images are handled separately
          // titlePicture: profileData.titlePicture,
          // profilePicture: profileData.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        // Create a properly typed User object for the Redux store
        const updatedUser: User = {
          ...user,
          username: profileData.username,
          bio: profileData.bio,
          // Keep the existing image paths
          titlePicture: user.titlePicture,
          profilePicture: user.profilePicture,
        }

        // Update Redux store
        dispatch(
          login({
            user: updatedUser,
            csrfToken: localStorage.getItem("csrfToken") || "",
          }),
        )

        toast.success("Profile updated successfully")
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create FormData to send the file
    const formData = new FormData()
    formData.append(type === "profile" ? "profilePicture" : "titlePicture", file)

    // Show a temporary preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          [type === "profile" ? "profilePicture" : "titlePicture"]: reader.result as string,
        }
      })
    }
    reader.readAsDataURL(file)

    // Upload the file
    axios
      .put(`${API_BASE_URL}/${user?.userId}`, formData, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(`${type === "profile" ? "Profile" : "Cover"} picture updated successfully`)

          // Update Redux store with the new image path
          if (user) {
            const updatedUser = {
              ...user,
              [type === "profile" ? "profilePicture" : "titlePicture"]:
                response.data.data[type === "profile" ? "profilePicture" : "titlePicture"],
            }

            dispatch(
              login({
                user: updatedUser,
                csrfToken: localStorage.getItem("csrfToken") || "",
              }),
            )
          }
        }
      })
      .catch((error) => {
        console.error(`Error updating ${type} picture:`, error)
        toast.error(`Failed to update ${type === "profile" ? "profile" : "cover"} picture`)
      })
  }

  const handleFollowToggle = async () => {
    if (!profileData?.userId || !user?.userId) return

    try {
      const endpoint = isFollowing
        ? `${API_BASE_URL}/${profileData.userId}/unfollow`
        : `${API_BASE_URL}/${profileData.userId}/follow`

      const response = await axios.post(
        endpoint,
        {
          unfollowUserId: user.userId,
          followUserId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            csrfToken: localStorage.getItem("csrfToken") || "",
          },
        },
      )

      if (response.data.success) {
        setIsFollowing(!isFollowing)

        // Update follow stats
        const statsResponse = await axios.get(`${API_BASE_URL}/${profileData.userId}/follow-stats`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })

        if (statsResponse.data.success) {
          setFollowStats(statsResponse.data.data)
        }

        toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully")
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast.error("Failed to update follow status")
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user?.userId) return

    try {
      setIsCreatingPost(true)

      const response = await axios.post(
        `${API_BASE_URL}/${user.userId}/post`,
        {
          content: newPostContent,
          tags: postTags.length > 0 ? postTags : ["general"],
          badges: ["new"],
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )

      if (response.data.success) {
        // Add the new post to the profile data
        const newPost = response.data.data
        setProfileData((prev) => {
          if (!prev) return prev

          return {
            ...prev,
            posts: [newPost, ...(prev.posts || [])],
          }
        })

        setNewPostContent("")
        setPostTags([])
        toast.success("Post created successfully")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!user?.userId) return

    try {
      const response = await axios.delete(`${API_BASE_URL}/${user.userId}/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.data.success) {
        // Remove the deleted post from the profile data
        setProfileData((prev) => {
          if (!prev) return prev

          return {
            ...prev,
            posts: prev.posts?.filter((post) => post.identifier !== postId) || [],
          }
        })

        toast.success("Post deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post")
    }
  }

  const handleUpdatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!user?.userId) return

    try {
      const response = await axios.put(
        `${API_BASE_URL}/${user.userId}/settings/privacy`,
        { privacySettings: settings },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )

      if (response.data.success) {
        // Update privacy settings in profile data
        setProfileData((prev) => {
          if (!prev) return prev

          // Create a properly typed privacy settings object
          const updatedPrivacySettings: PrivacySettings = {
            visibility: (settings.visibility || prev.privacySettings?.visibility || "public") as
              | "public"
              | "followers"
              | "private",
            showOnlineState:
              settings.showOnlineState !== undefined
                ? settings.showOnlineState
                : prev.privacySettings?.showOnlineState || true,
            showActivity:
              settings.showActivity !== undefined ? settings.showActivity : prev.privacySettings?.showActivity || true,
          }

          return {
            ...prev,
            privacySettings: updatedPrivacySettings,
          }
        })

        toast.success("Privacy settings updated successfully")
      }
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast.error("Failed to update privacy settings")
    }
  }

  const handleLogoutAllSessions = async () => {
    if (!user?.userId) return

    const confirmPassword = prompt("Please enter your password to confirm logging out from all devices")
    if (!confirmPassword) return

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${user.userId}/logout-all`,
        { confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )

      if (response.data.success) {
        toast.success("Logged out from all other devices")
      }
    } catch (error) {
      console.error("Error logging out from all sessions:", error)
      toast.error("Failed to logout from all sessions")
    }
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

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section with Blob */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        {/* Profile Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            {/* Cover Image */}
            <div className="relative">
              <div
                className="w-full h-64 sm:h-80 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${profileData?.titlePicture || "https://placehold.co/1200x400/png"})`,
                  backgroundPosition: "center",
                }}
              >
                {isEditing && (
                  <div className="absolute bottom-4 right-4">
                    <label
                      htmlFor="cover-image"
                      className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-black/60 transition-all duration-200"
                    >
                      <Camera size={18} />
                      Change Cover
                    </label>
                    <input
                      type="file"
                      id="cover-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, "cover")}
                    />
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="absolute bottom-[-48px] left-8 sm:left-12">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                    <img
                      src={profileData?.profilePicture || "https://placehold.co/400x400/png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer text-white shadow-md transition-colors duration-200"
                    >
                      <Camera size={16} />
                    </label>
                  )}
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "profile")}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {!isEditing ? (
                  <>
                    {profileData?.userId === user?.userId && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Edit size={16} />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </button>
                    )}

                    {profileData?.userId !== user?.userId && (
                      <button
                        onClick={handleFollowToggle}
                        className={`flex items-center gap-2 px-4 py-2 ${
                          isFollowing
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        } rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus size={16} />
                            <span className="hidden sm:inline">Unfollow</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            <span className="hidden sm:inline">Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Save size={16} />
                      <span className="hidden sm:inline">Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileData?.username}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData?.email}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profileData?.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {profileData.role}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-6 mt-4 sm:mt-0">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.posts?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{followStats.followers || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{followStats.following || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea
                      value={profileData?.bio || ""}
                      onChange={(e) => setProfileData((prev) => (prev ? { ...prev, bio: e.target.value } : prev))}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      rows={4}
                      placeholder="Write something about yourself..."
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">About</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {profileData?.bio || "No bio yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        {profileData?.userId === user?.userId && (
          <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab("posts")}
                className={`inline-flex items-center px-4 py-2 border-b-2 ${
                  activeTab === "posts"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Posts
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`inline-flex items-center px-4 py-2 border-b-2 ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Member since {new Date(profileData?.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {profileData?.posts?.length || 0} posts published
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Last updated {new Date(profileData?.updatedAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connections</h3>
                <div className="space-y-4">
                  <div className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <Discord className="w-4 h-4 text-[#5865F2]" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Discord</span>
                    </div>
                    <span
                      className={`text-xs ${profileData?.verification?.discord?.verified ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
                    >
                      {profileData?.verification?.discord?.verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Email</span>
                    </div>
                    <span
                      className={`text-xs ${profileData?.verification?.email?.verified ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
                    >
                      {profileData?.verification?.email?.verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">SMS</span>
                    </div>
                    <span
                      className={`text-xs ${profileData?.verification?.sms?.verified ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
                    >
                      {profileData?.verification?.sms?.verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {profileData?.userId === user?.userId && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleLogoutAllSessions}
                      className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>Logout from all devices</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Settings Tab */}
            {activeTab === "settings" && profileData?.userId === user?.userId && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h3>

                  {/* Privacy Settings */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Privacy Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={profileData?.privacySettings?.visibility || "public"}
                          onChange={(e) => {
                            const value = e.target.value as "public" | "followers" | "private"
                            handleUpdatePrivacySettings({ visibility: value })
                          }}
                          className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="public">Public - Anyone can view your profile</option>
                          <option value="followers">Followers Only - Only followers can view your profile</option>
                          <option value="private">Private - Only you can view your profile</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Show Online Status
                        </label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="online-status"
                            className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 dark:border-gray-600 checked:right-0 checked:border-blue-600 dark:checked:border-blue-400 checked:bg-blue-600 dark:checked:bg-blue-400"
                            checked={profileData?.privacySettings?.showOnlineState || false}
                            onChange={(e) => handleUpdatePrivacySettings({ showOnlineState: e.target.checked })}
                          />
                          <label
                            htmlFor="online-status"
                            className="block h-full overflow-hidden transition duration-200 ease-in-out rounded-full cursor-pointer bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-200 dark:peer-checked:bg-blue-900/50"
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Show Activity Status
                        </label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="activity-status"
                            className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 dark:border-gray-600 checked:right-0 checked:border-blue-600 dark:checked:border-blue-400 checked:bg-blue-600 dark:checked:bg-blue-400"
                            checked={profileData?.privacySettings?.showActivity || false}
                            onChange={(e) => handleUpdatePrivacySettings({ showActivity: e.target.checked })}
                          />
                          <label
                            htmlFor="activity-status"
                            className="block h-full overflow-hidden transition duration-200 ease-in-out rounded-full cursor-pointer bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-200 dark:peer-checked:bg-blue-900/50"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 dark:border-gray-600 checked:right-0 checked:border-blue-600 dark:checked:border-blue-400 checked:bg-blue-600 dark:checked:bg-blue-400"
                            checked={profileData?.emailNotification || false}
                            onChange={(e) => {
                              setProfileData((prev) => (prev ? { ...prev, emailNotification: e.target.checked } : prev))
                            }}
                          />
                          <label
                            htmlFor="email-notifications"
                            className="block h-full overflow-hidden transition duration-200 ease-in-out rounded-full cursor-pointer bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-200 dark:peer-checked:bg-blue-900/50"
                          ></label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Push Notifications
                        </label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            id="push-notifications"
                            className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-gray-300 dark:border-gray-600 checked:right-0 checked:border-blue-600 dark:checked:border-blue-400 checked:bg-blue-600 dark:checked:bg-blue-400"
                            checked={profileData?.pushNotification || false}
                            onChange={(e) => {
                              setProfileData((prev) => (prev ? { ...prev, pushNotification: e.target.checked } : prev))
                            }}
                          />
                          <label
                            htmlFor="push-notifications"
                            className="block h-full overflow-hidden transition duration-200 ease-in-out rounded-full cursor-pointer bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-200 dark:peer-checked:bg-blue-900/50"
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Theme Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Theme Mode
                        </label>
                        <select
                          value={profileData?.theme || "system"}
                          onChange={(e) => {
                            setProfileData((prev) =>
                              prev ? { ...prev, theme: e.target.value as "light" | "dark" } : prev,
                            )
                          }}
                          className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={profileData?.language || "en"}
                          onChange={(e) => {
                            setProfileData((prev) => (prev ? { ...prev, language: e.target.value } : prev))
                          }}
                          className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="en">English</option>
                          <option value="de">German</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProfileUpdate}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {/* Create Post (only for own profile) */}
                {profileData?.userId === user?.userId && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create a Post</h3>
                      <div className="space-y-4">
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          rows={4}
                          placeholder="What's on your mind?"
                        />

                        <div className="flex flex-wrap gap-2 items-center">
                          {postTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                            >
                              #{tag}
                              <button
                                onClick={() => setPostTags(postTags.filter((_, i) => i !== index))}
                                className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              >
                                &times;
                              </button>
                            </span>
                          ))}

                          <div className="flex items-center">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newTag.trim()) {
                                  e.preventDefault()
                                  setPostTags([...postTags, newTag.trim()])
                                  setNewTag("")
                                }
                              }}
                              className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Add tag..."
                            />
                            <button
                              onClick={() => {
                                if (newTag.trim()) {
                                  setPostTags([...postTags, newTag.trim()])
                                  setNewTag("")
                                }
                              }}
                              className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim() || isCreatingPost}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isCreatingPost ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts List */}
                <div className="space-y-6">
                  {profileData?.posts && profileData.posts.length > 0 ? (
                    profileData.posts.map((post) => (
                      <div
                        key={post.identifier}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
                      >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                <img
                                  src={profileData.profilePicture || "https://placehold.co/400x400/png"}
                                  alt={profileData.username}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                                  {profileData.username}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(post.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {profileData.userId === user?.userId && (
                              <button
                                onClick={() => handleDeletePost(post.identifier)}
                                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>

                          {post.title && (
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                          )}

                          {post.image && (
                            <div className="mb-4 rounded-xl overflow-hidden">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.title || "Post"}
                                className="w-full h-auto"
                              />
                            </div>
                          )}

                          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                            {post.content}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {profileData?.userId === user?.userId
                            ? "Create your first post to share with your followers!"
                            : "This user hasn't posted anything yet."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile

