"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { login } from "../../stores/authSlice"
import axios from "axios"
import LazyLoading from "../../components/LazyLoading"
import { Edit, Camera, Users, MessageSquare, Calendar, Heart, UserPlus, UserMinus, Save, X } from "lucide-react"

interface User {
  identifier: string
  socketId: string
  accessToken: string
  refreshToken: string
  userId: string
  titlePicture?: string
  profilePicture?: string
  email?: string
  username: string
  role: string
  bio?: string
  follower?: string[]
  following?: string[]
  posts?: any[]
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const { username } = useParams<{ username: string }>()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setLoading(false)
      return
    }

    const isOwnProfile = username === user.username || username === user.userId

    if (isOwnProfile) {
      setProfileData({
        identifier: user.identifier,
        socketId: user.socketId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        userId: user.userId,
        titlePicture: user.titlePicture,
        profilePicture: user.profilePicture,
        email: user.email,
        username: user.username,
        role: user.role,
        bio: user.bio,
        posts: user.posts || [],
        follower: user.follower || [],
        following: user.following || [],
        twoFactorEnabled: user.twoFactorEnabled || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      setIsFollowing(false)
      setLoading(false)
      return
    }

    axios
      .get(`http://localhost:3001/api/users/${username}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        const fetchedProfileData: User = {
          ...response.data,
          posts: response.data.posts || [],
          follower: response.data.follower?.map((f: { userId: string }) => f.userId) || [],
          following: response.data.following?.map((f: { userId: string }) => f.userId) || [],
          twoFactorEnabled: response.data.twoFactorEnabled || false,
        }

        setProfileData(fetchedProfileData)
        setIsFollowing(fetchedProfileData.follower?.includes(user.userId) ?? false)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error)
        setLoading(false)
      })
  }, [isAuthenticated, user, username])

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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData) {
      dispatch(login({ user: profileData, csrfToken: localStorage.getItem("csrfToken") || "" }))
      setIsEditing(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                [type === "profile" ? "profilePicture" : "titlePicture"]: reader.result as string,
              }
            : prev,
        )
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFollowToggle = async () => {
    try {
      const csrfToken = localStorage.getItem("csrfToken")

      if (!csrfToken) {
        console.error("CSRF Token not found")
        return
      }

      const endpoint = isFollowing
        ? `http://localhost:3001/api/users/${user?.userId}/unfollow`
        : `http://localhost:3001/api/users/${user?.userId}/follow`

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            csrfToken: csrfToken,
          },
        },
      )

      console.log(response.data)

      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
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
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </button>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.follower?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.following?.length || 0}
                    </p>
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connections</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Discord</span>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>

                {profileData?.posts && profileData.posts.length > 0 ? (
                  <div className="space-y-6">
                    {profileData.posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={profileData.profilePicture || "https://placehold.co/400x400/png"}
                            alt={profileData.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{profileData.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(post.createdAt || new Date()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{post.content || "No content"}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Heart size={16} />
                            <span className="text-xs">{post.likes || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <MessageSquare size={16} />
                            <span className="text-xs">{post.comments?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      View all posts
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                      Create your first post
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Followers</h3>

                {profileData?.follower && profileData.follower.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array(Math.min(6, profileData.follower.length))
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <img
                            src={`https://placehold.co/400x400/png?text=User${index + 1}`}
                            alt={`Follower ${index + 1}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white truncate">User {index + 1}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Follower</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No followers yet.</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Share your profile to gain followers.
                    </p>
                  </div>
                )}

                {profileData?.follower && profileData.follower.length > 0 && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      View all followers
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Following</h3>

                {profileData?.following && profileData.following.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array(Math.min(6, profileData.following.length))
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <img
                            src={`https://placehold.co/400x400/png?text=User${index + 1}`}
                            alt={`Following ${index + 1}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white truncate">User {index + 1}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Not following anyone yet.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                      Discover people
                    </button>
                  </div>
                )}

                {profileData?.following && profileData.following.length > 0 && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      View all following
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile

