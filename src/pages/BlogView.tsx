"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ChevronRight,
  Tag,
  Loader2,
  Edit,
  Trash2,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react"

// Interface that matches your Mongoose model structure
interface User {
  _id: string
  username: string
  profileImage?: string
}

interface IComment {
  _id: string
  identifier: string
  user: User | string
  username: string
  profileImage?: string
  content: string
  createdAt: string
  updatedAt: string
}

interface IReaction {
  _id: string
  user: User | string
  type: "like" | "dislike"
}

interface BlogPost {
  _id: string
  identifier: string
  title: string
  description: string
  content: string
  image?: string
  tags: string[]
  author: User | string
  reactions: IReaction[]
  comments: IComment[]
  createdAt: string
  updatedAt: string
  date?: string
  category?: string
  readTime?: string
}

// API URL from environment or default
const API_URL = "http://localhost:3001/api"

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Newsletter state
  const [email, setEmail] = useState("")
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)

  // Share functionality
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const shareModalRef = useRef<HTMLDivElement>(null)

  // Edit/Delete modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editImage, setEditImage] = useState("")
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Check if user has admin role
  const isAdmin =
    user?.role?.includes("Admin") ||
    user?.role?.includes("Moderator") ||
    user?.role?.includes("Developer") ||
    user?.role?.includes("Content") ||
    user?.role?.includes("Supporter") ||
    false

  // Fetch blog post and related data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true)

        // Fetch the blog post
        const response = await fetch(`${API_URL}/blogs/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated && user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
          },
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Process the post data
        const processedPost = {
          ...data,
          date: formatDate(data.createdAt),
          category: data.tags && data.tags.length > 0 ? data.tags[0] : "Allgemein",
          readTime: calculateReadTime(data.content),
        }

        setPost(processedPost)

        // Set edit form values
        setEditTitle(processedPost.title)
        setEditDescription(processedPost.description)
        setEditContent(processedPost.content)
        setEditTags(processedPost.tags.join(", "))
        setEditImage(processedPost.image || "")

        // Fetch related posts (excluding current post)
        const relatedResponse = await fetch(`${API_URL}/blogs`, {
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated && user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
          },
        })

        if (relatedResponse.ok) {
          const allPosts = await relatedResponse.json()
          // Filter out current post and limit to 3 related posts
          const relatedData = allPosts.filter((post: BlogPost) => post._id !== id).slice(0, 3)

          const processedRelated = relatedData.map((relPost: BlogPost) => ({
            ...relPost,
            date: formatDate(relPost.createdAt),
            category: relPost.tags && relPost.tags.length > 0 ? relPost.tags[0] : "Allgemein",
          }))
          setRelatedPosts(processedRelated)

          // Extract unique categories from all posts
          const uniqueCategories = Array.from(
            new Set(allPosts.flatMap((post: BlogPost) => post.tags).filter(Boolean)),
          ) as string[]
          setCategories(uniqueCategories)
        }

        setError(null)
      } catch (err: any) {
        console.error("Error fetching blog post:", err)
        setError("Failed to load blog post. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchBlogPost()
    }
  }, [id, isAuthenticated, user])

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("de-DE", options)
  }

  // Helper function to calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min`
  }

  // Helper function to get author name
  const getAuthorName = (author: User | string): string => {
    if (!author) return "Unknown Author"
    if (typeof author === "string") {
      return author
    }
    return author.username || "Unknown Author"
  }

  // Helper function to get author image
  const getAuthorImage = (author: User | string): string => {
    if (!author) return "/placeholder.svg?height=48&width=48"
    if (typeof author === "string") {
      return "/placeholder.svg?height=48&width=48"
    }
    return author.profileImage || "/placeholder.svg?height=48&width=48"
  }

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
      }

      if (shareModalRef.current && !shareModalRef.current.contains(event.target as Node)) {
        setIsShareModalOpen(false)
      }
    }

    if (isEditModalOpen || isDeleteModalOpen || isShareModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditModalOpen, isDeleteModalOpen, isShareModalOpen])

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    try {
      setIsSubmittingNewsletter(true)
      setNewsletterError(null)

      const response = await fetch(`${API_URL}/newsletters/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe to newsletter")
      }

      setNewsletterSuccess(true)
      setEmail("")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setNewsletterSuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error("Error subscribing to newsletter:", err)
      setNewsletterError("Failed to subscribe. Please try again later.")
    } finally {
      setIsSubmittingNewsletter(false)
    }
  }

  // Handle share functionality
  const handleShare = () => {
    setIsShareModalOpen(true)
    setIsCopied(false)
  }

  // Copy URL to clipboard
  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  // Share on social media
  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || "")

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
    setIsShareModalOpen(false)
  }

  // Handle edit blog post
  const handleEditBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !isAdmin || !post || !id) {
      return
    }

    try {
      setIsSubmittingEdit(true)

      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken} ${user?.role}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          content: editContent,
          tags: editTags.split(",").map((tag) => tag.trim()),
          image: editImage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog post")
      }

      // Refresh the post data
      const updatedPostResponse = await fetch(`${API_URL}/blogs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken} ${user?.role}`,
        },
      })

      if (updatedPostResponse.ok) {
        const updatedData = await updatedPostResponse.json()
        const processedPost = {
          ...updatedData,
          date: formatDate(updatedData.createdAt),
          category: updatedData.tags && updatedData.tags.length > 0 ? updatedData.tags[0] : "Allgemein",
          readTime: calculateReadTime(updatedData.content),
        }
        setPost(processedPost)
      }

      setIsEditModalOpen(false)
    } catch (err) {
      console.error("Error updating blog post:", err)
      alert("Failed to update blog post. Please try again.")
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  // Handle delete blog post
  const handleDeleteBlogPost = async () => {
    if (!isAuthenticated || !isAdmin || !post || !id) {
      return
    }

    try {
      setIsSubmittingDelete(true)

      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken} ${user?.role}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }

      // Navigate back to blog list
      navigate("/news")
    } catch (err) {
      console.error("Error deleting blog post:", err)
      alert("Failed to delete blog post. Please try again.")
    } finally {
      setIsSubmittingDelete(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Lade Beitrag...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
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
              Artikel nicht gefunden
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
              {error || "Der gesuchte Artikel existiert nicht oder wurde entfernt."}
            </p>
            <button
              onClick={() => navigate("/news")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const authorName = getAuthorName(post.author)
  const authorImage = getAuthorImage(post.author)

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex justify-between items-center mb-8">
            <motion.button
              onClick={() => navigate("/news")}
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Zurück</span>
            </motion.button>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Bearbeiten</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Löschen</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} Lesezeit
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>

                <div className="flex items-center mb-8">
                  <img
                    src={authorImage || "/placeholder.svg"}
                    alt={authorName}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{authorName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Autor</p>
                  </div>
                </div>

                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg?height=600&width=1200"}
                    alt={post.title}
                    className="w-full h-auto object-cover dark:text-white"
                  />
                </div>

                <div
                  className="prose prose-lg max-w-none dark:text-white dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Teilen</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Über den Autor</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={authorImage || "/placeholder.svg"}
                    alt={authorName}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{authorName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Autor</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {authorName} ist ein erfahrenes Mitglied des LifeVerse-Teams und teilt regelmäßig Einblicke in die
                  Entwicklung und Features des Spiels.
                </p>
                <button
                  onClick={() => navigate(`/news?author=${authorName}`)}
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Alle Artikel von diesem Autor
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Verwandte Artikel</h2>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost._id}
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => navigate(`/news/${relatedPost._id}`)}
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={relatedPost.image || "/placeholder.svg?height=80&width=80"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{relatedPost.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kategorien</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/news?category=${category}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Newsletter abonnieren</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Erhalte die neuesten Updates und Artikel direkt in dein Postfach.
                </p>
                {newsletterSuccess ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <p className="text-green-700 dark:text-green-300">
                      Vielen Dank für deine Anmeldung! Du erhältst in Kürze eine Bestätigungsmail.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Deine E-Mail-Adresse"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    {newsletterError && <p className="text-red-600 dark:text-red-400 text-sm">{newsletterError}</p>}
                    <button
                      type="submit"
                      disabled={isSubmittingNewsletter}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmittingNewsletter ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Wird verarbeitet...
                        </span>
                      ) : (
                        "Abonnieren"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={shareModalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Artikel teilen</h2>
              <div className="flex justify-center space-x-6 mb-6">
                <button
                  onClick={() => shareOnSocialMedia("facebook")}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </button>
                <button
                  onClick={() => shareOnSocialMedia("twitter")}
                  className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </button>
                <button
                  onClick={() => shareOnSocialMedia("linkedin")}
                  className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors flex items-center"
                >
                  {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              {isCopied && (
                <p className="text-green-600 dark:text-green-400 mt-2">Link in die Zwischenablage kopiert!</p>
              )}

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Artikel bearbeiten</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditBlogPost}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Titel
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Beschreibung
                    </label>
                    <textarea
                      id="description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Inhalt
                    </label>
                    <textarea
                      id="content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={10}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags (durch Komma getrennt)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="z.B. News, Update, Feature"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bild URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="mr-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingEdit ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Wird gespeichert...
                      </span>
                    ) : (
                      "Änderungen speichern"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Artikel löschen</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bist du sicher, dass du diesen Artikel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht
                werden.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleDeleteBlogPost}
                  disabled={isSubmittingDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingDelete ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Wird gelöscht...
                    </span>
                  ) : (
                    "Ja, löschen"
                  )}
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

export default BlogView

