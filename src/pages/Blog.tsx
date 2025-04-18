"use client"

import type React from "react"
import type { RootState } from "../stores/store"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, Calendar, ArrowRight, Tag, Loader2, AlertCircle, Plus, X, ImageIcon } from "lucide-react"

// Interface that matches your Mongoose model structure
interface IReaction {
  _id: string
  user: string
  type: "like" | "dislike"
}

interface IComment {
  _id: string
  identifier: string
  user: string
  username: string
  profileImage?: string
  content: string
  createdAt: string
  updatedAt: string
}

interface BlogPost {
  _id: string
  identifier: string
  title: string
  description: string
  content: string
  image?: string
  tags: string[]
  author: string
  reactions: IReaction[]
  comments: IComment[]
  createdAt: string
  updatedAt: string
  // Frontend display properties
  date?: string
  category?: string
  readTime?: string
}

// API URL from environment or default
const API_URL = "http://localhost:3001/api"

const Blog: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create blog modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogDescription, setNewBlogDescription] = useState("")
  const [newBlogContent, setNewBlogContent] = useState("")
  const [newBlogTags, setNewBlogTags] = useState("")
  const [newBlogImage, setNewBlogImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)

  // Check if user has admin role
  const isAdmin =
    user?.role?.includes("Admin") ||
    user?.role?.includes("Moderator") ||
    user?.role?.includes("Developer") ||
    user?.role?.includes("Content") ||
    user?.role?.includes("Supporter") ||
    false

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/blogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(isAuthenticated && user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
          },
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Sort posts by createdAt date in descending order (newest first)
        data.sort((a: BlogPost, b: BlogPost) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        // Process the data to match our component's needs
        const processedPosts = data.map((post: BlogPost) => {
          // Extract category from first tag if not provided
          const category = post.category || (post.tags && post.tags.length > 0 ? post.tags[0] : "Allgemein")

          // Format date
          const date = formatDate(post.createdAt)

          // Calculate read time if not provided
          const readTime = calculateReadTime(post.content)

          return {
            ...post,
            category,
            date,
            readTime,
          }
        })

        setBlogPosts(processedPosts)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(processedPosts.flatMap((post: BlogPost) => post.tags))) as string[]
        setCategories(uniqueCategories)

        setError(null)
      } catch (err: any) {
        console.error("Error fetching blog posts:", err)
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [isAuthenticated, user])

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

  // Filter blog posts based on search query and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? post.tags.includes(selectedCategory) : true
    return matchesSearch && matchesCategory
  })

  // Get featured post (first post or null if no posts)
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null

  // Handle click on blog post to navigate to blog-view
  const handleBlogPostClick = (postId: string) => {
    navigate(`/news/${postId}`)
  }

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsCreateModalOpen(false)
      }
    }

    if (isCreateModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCreateModalOpen])

  // Handle create blog post
  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !isAdmin) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken} ${user?.role}`,
        },
        body: JSON.stringify({
          title: newBlogTitle,
          description: newBlogDescription,
          content: newBlogContent,
          tags: newBlogTags.split(",").map((tag) => tag.trim()),
          author: user?.username,
          image: newBlogImage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create blog post")
      }

      // Reset form and close modal
      setNewBlogTitle("")
      setNewBlogDescription("")
      setNewBlogContent("")
      setNewBlogTags("")
      setNewBlogImage("")
      setIsCreateModalOpen(false)

      // Refresh blog posts
      const refreshResponse = await fetch(`${API_URL}/blogs`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const processedPosts = data.map((post: BlogPost) => {
          const category = post.category || (post.tags && post.tags.length > 0 ? post.tags[0] : "Allgemein")
          const date = formatDate(post.createdAt)
          const readTime = calculateReadTime(post.content)

          return {
            ...post,
            category,
            date,
            readTime,
          }
        })

        setBlogPosts(processedPosts)
      }
    } catch (err) {
      console.error("Error creating blog post:", err)
      alert("Failed to create blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) return

    try {
      setIsSubmittingNewsletter(true)
      setNewsletterError(null)

      const response = await fetch(`${API_URL}/newsletters/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe to newsletter")
      }

      setNewsletterSuccess(true)
      setNewsletterEmail("")

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              LifeVerse News
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Bleibe auf dem Laufenden mit den neuesten Entwicklungen, Updates und Geschichten aus der Welt von
              LifeVerse.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suche nach Artikeln..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full md:w-auto px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Create Blog Button */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Neuen Artikel erstellen</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Lade Beiträge...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Fehler beim Laden</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )}

      {/* Featured Post */}
      {!isLoading && featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="h-64 lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.image || "/placeholder.svg?height=600&width=400"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredPost.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{featuredPost.readTime} Lesezeit</span>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => handleBlogPostClick(featuredPost._id)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Weiterlesen</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Neueste Artikel</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

          {filteredPosts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer group"
                  onClick={() => handleBlogPostClick(post._id)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=400&width=600"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{post.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.readTime} Lesezeit</span>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Weiterlesen →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : filteredPosts.length === 1 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Keine weiteren Artikel</h3>
              <p className="text-gray-600 dark:text-gray-400">Schau später wieder vorbei für mehr Inhalte.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Keine Artikel gefunden</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Versuche andere Suchbegriffe oder Filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Categories Section */}
      {!isLoading && categories.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Kategorien</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                const count = blogPosts.filter((post) => post.tags.includes(category)).length
                return (
                  <motion.div
                    key={category}
                    whileHover={{ y: -5 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-pointer ${
                      selectedCategory === category ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{category}</h3>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div className="md:w-0 md:flex-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Bleibe auf dem Laufenden
                </h2>
                <p className="mt-3 max-w-md text-lg text-blue-100">
                  Abonniere unseren Newsletter und erhalte die neuesten Updates direkt in dein Postfach.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                {newsletterSuccess ? (
                  <div className="bg-white/10 p-4 rounded-lg text-white">
                    <p className="font-medium">Vielen Dank für deine Anmeldung!</p>
                    <p className="text-sm mt-1">Du erhältst in Kürze eine Bestätigungsmail.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="sm:flex">
                    <label htmlFor="email-address" className="sr-only">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                      placeholder="Deine E-Mail-Adresse"
                    />
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                      <button
                        type="submit"
                        disabled={isSubmittingNewsletter}
                        className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white disabled:opacity-75"
                      >
                        {isSubmittingNewsletter ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Wird verarbeitet...
                          </span>
                        ) : (
                          "Abonnieren"
                        )}
                      </button>
                    </div>
                  </form>
                )}
                {newsletterError && <p className="mt-2 text-sm text-red-200">{newsletterError}</p>}
                <p className="mt-3 text-sm text-blue-100">
                  Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Blog Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Neuen Artikel erstellen</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateBlogPost}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Titel
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
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
                      value={newBlogDescription}
                      onChange={(e) => setNewBlogDescription(e.target.value)}
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
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
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
                      value={newBlogTags}
                      onChange={(e) => setNewBlogTags(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="z.B. News, Update, Feature"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bild URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="image"
                        value={newBlogImage}
                        onChange={(e) => setNewBlogImage(e.target.value)}
                        className="w-full px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-r-lg border-y border-r border-gray-300 dark:border-gray-600">
                        <ImageIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Lasse dieses Feld leer, um ein Platzhalterbild zu verwenden.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="mr-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Wird erstellt...
                      </span>
                    ) : (
                      "Artikel erstellen"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Blog

