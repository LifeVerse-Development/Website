"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import LazyLoading from "../../components/LazyLoading"
import {
  Clock,
  MessageSquare,
  Heart,
  Share2,
  ShoppingBag,
  LogIn,
  UserPlus,
  Award,
  ArrowLeft,
  AlertCircle,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Tag,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import axios from "axios"

// Define the history item interface
export interface HistoryItem {
  id: string
  type: "share" | "post" | "comment" | "like" | "follow" | "purchase" | "login" | "achievement"
  title: string
  description?: string
  timestamp: string
  link?: string
  metadata?: {
    [key: string]: any
  }
  relatedItems?: HistoryItem[]
}

const HistoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.userId || !id) {
      setLoading(false)
      return
    }

    const fetchHistoryItem = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`/api/history/${id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })

        setHistoryItem(response.data)
      } catch (err) {
        console.error("Error fetching history item:", err)
        setError("Failed to load history item. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistoryItem()
  }, [id, isAuthenticated, user])

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <MessageSquare className="h-5 w-5" />
      case "comment":
        return <MessageSquare className="h-5 w-5" />
      case "like":
        return <Heart className="h-5 w-5" />
      case "follow":
        return <UserPlus className="h-5 w-5" />
      case "purchase":
        return <ShoppingBag className="h-5 w-5" />
      case "login":
        return <LogIn className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      case "share":
        return <Share2 className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  // Get background color based on activity type
  const getActivityBg = (type: string) => {
    switch (type) {
      case "post":
      case "comment":
        return "bg-blue-100 dark:bg-blue-900/30"
      case "like":
        return "bg-red-100 dark:bg-red-900/30"
      case "follow":
        return "bg-purple-100 dark:bg-purple-900/30"
      case "purchase":
        return "bg-green-100 dark:bg-green-900/30"
      case "login":
        return "bg-amber-100 dark:bg-amber-900/30"
      case "achievement":
        return "bg-yellow-100 dark:bg-yellow-900/30"
      case "share":
        return "bg-indigo-100 dark:bg-indigo-900/30"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  // Get text color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "post":
      case "comment":
        return "text-blue-600 dark:text-blue-400"
      case "like":
        return "text-red-600 dark:text-red-400"
      case "follow":
        return "text-purple-600 dark:text-purple-400"
      case "purchase":
        return "text-green-600 dark:text-green-400"
      case "login":
        return "text-amber-600 dark:text-amber-400"
      case "achievement":
        return "text-yellow-600 dark:text-yellow-400"
      case "share":
        return "text-indigo-600 dark:text-indigo-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date)
  }

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
              Please log in to view your activity details.
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

  if (error || !historyItem) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error || "Activity not found"}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error
                ? "We couldn't load this activity. Please try again later."
                : "The activity you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/history")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Back to History
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section with Blob */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/history")}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Details</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Viewing detailed information about this activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          {/* Activity Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 ${getActivityBg(historyItem.type)} rounded-full flex items-center justify-center`}
              >
                <span className={getActivityColor(historyItem.type)}>{getActivityIcon(historyItem.type)}</span>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{historyItem.title}</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(historyItem.timestamp)}
                  </span>
                </div>

                {historyItem.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{historyItem.description}</p>
                )}

                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                    {historyItem.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Details */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Information</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Activity ID:</span>
                      <span className="text-gray-900 dark:text-white font-mono text-sm">{historyItem.id}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span className="text-gray-900 dark:text-white capitalize">{historyItem.type}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(historyItem.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Time:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(historyItem.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Type-specific details */}
                {historyItem.type === "login" && historyItem.metadata && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Login Details</h4>

                    <div className="space-y-3">
                      {historyItem.metadata.device && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Device:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.device}</span>
                        </div>
                      )}

                      {historyItem.metadata.browser && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Browser:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.browser}</span>
                        </div>
                      )}

                      {historyItem.metadata.ip && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">
                            {historyItem.metadata.ip}
                          </span>
                        </div>
                      )}

                      {historyItem.metadata.location && (
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Location:</span>
                          <span className="text-gray-900 dark:text-white text-right">
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {historyItem.metadata.location}
                            </div>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {historyItem.type === "purchase" && historyItem.metadata && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Purchase Details</h4>

                    <div className="space-y-3">
                      {historyItem.metadata.item && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Item:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.item}</span>
                        </div>
                      )}

                      {historyItem.metadata.amount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className="text-gray-900 dark:text-white">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: historyItem.metadata.currency || "USD",
                            }).format(historyItem.metadata.amount)}
                          </span>
                        </div>
                      )}

                      {historyItem.metadata.paymentMethod && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
                          <span className="text-gray-900 dark:text-white flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {historyItem.metadata.paymentMethod}
                          </span>
                        </div>
                      )}

                      {historyItem.metadata.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">
                            {historyItem.metadata.transactionId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {historyItem.type === "achievement" && historyItem.metadata && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Achievement Details</h4>

                    <div className="space-y-3">
                      {historyItem.metadata.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Name:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.name}</span>
                        </div>
                      )}

                      {historyItem.metadata.description && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Description:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.description}</span>
                        </div>
                      )}

                      {historyItem.metadata.points !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Points:</span>
                          <span className="text-gray-900 dark:text-white">{historyItem.metadata.points}</span>
                        </div>
                      )}

                      {historyItem.metadata.rarity && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Rarity:</span>
                          <span className="text-gray-900 dark:text-white capitalize">
                            {historyItem.metadata.rarity}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-4">
                {/* Content details for post, comment, share */}
                {(historyItem.type === "post" || historyItem.type === "comment" || historyItem.type === "share") &&
                  historyItem.metadata && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Content Details</h4>

                      {historyItem.metadata.content && (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mb-3">
                          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {historyItem.metadata.content}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {historyItem.metadata.contentType && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <span className="text-gray-900 dark:text-white capitalize">
                              {historyItem.metadata.contentType}
                            </span>
                          </div>
                        )}

                        {historyItem.metadata.likes !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Likes:</span>
                            <span className="text-gray-900 dark:text-white">{historyItem.metadata.likes}</span>
                          </div>
                        )}

                        {historyItem.metadata.comments !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Comments:</span>
                            <span className="text-gray-900 dark:text-white">{historyItem.metadata.comments}</span>
                          </div>
                        )}

                        {historyItem.metadata.shares !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Shares:</span>
                            <span className="text-gray-900 dark:text-white">{historyItem.metadata.shares}</span>
                          </div>
                        )}
                      </div>

                      {historyItem.metadata.tags && historyItem.metadata.tags.length > 0 && (
                        <div className="mt-3">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Tags:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {historyItem.metadata.tags.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* User details for follow */}
                {historyItem.type === "follow" && historyItem.metadata && historyItem.metadata.user && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">User Details</h4>

                    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mb-3">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {historyItem.metadata.user.avatar ? (
                            <img
                              src={historyItem.metadata.user.avatar || "/placeholder.svg"}
                              alt={historyItem.metadata.user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {historyItem.metadata.user.username}
                        </p>
                        {historyItem.metadata.user.displayName && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {historyItem.metadata.user.displayName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {historyItem.metadata.user.followersCount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Followers:</span>
                          <span className="text-gray-900 dark:text-white">
                            {historyItem.metadata.user.followersCount}
                          </span>
                        </div>
                      )}

                      {historyItem.metadata.user.followingCount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Following:</span>
                          <span className="text-gray-900 dark:text-white">
                            {historyItem.metadata.user.followingCount}
                          </span>
                        </div>
                      )}

                      {historyItem.metadata.user.joinDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                          <span className="text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {new Date(historyItem.metadata.user.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {historyItem.metadata.user.profileUrl && (
                      <div className="mt-3">
                        <a
                          href={historyItem.metadata.user.profileUrl}
                          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          View Profile
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Related Activities */}
                {historyItem.relatedItems && historyItem.relatedItems.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Related Activities</h4>

                    <div className="space-y-3">
                      {historyItem.relatedItems.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                          onClick={() => navigate(`/history/${item.id}`)}
                        >
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 w-8 h-8 ${getActivityBg(item.type)} rounded-full flex items-center justify-center mr-3`}
                            >
                              <span className={getActivityColor(item.type)}>{getActivityIcon(item.type)}</span>
                            </div>

                            <div className="flex-grow">
                              <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </p>
                            </div>

                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Any additional metadata */}
                {historyItem.metadata && Object.keys(historyItem.metadata).length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Additional Information
                    </h4>

                    <div className="space-y-3">
                      {Object.entries(historyItem.metadata).map(([key, value]) => {
                        // Skip keys that are already displayed in specific sections
                        const skipKeys = [
                          "device",
                          "browser",
                          "ip",
                          "location",
                          "item",
                          "amount",
                          "currency",
                          "paymentMethod",
                          "transactionId",
                          "name",
                          "description",
                          "points",
                          "rarity",
                          "content",
                          "contentType",
                          "likes",
                          "comments",
                          "shares",
                          "tags",
                          "user",
                        ]

                        if (skipKeys.includes(key)) return null

                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-end gap-3">
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back to History
            </button>

            {historyItem.link && (
              <a
                href={historyItem.link}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View Original
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HistoryDetail

