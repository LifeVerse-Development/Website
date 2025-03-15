"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import {
  MessageSquare,
  ChevronLeft,
  ThumbsUp,
  Reply,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Pin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Clock,
  Eye,
  Tag,
  User,
  Calendar,
  MessageCircle,
  Share2,
} from "lucide-react"
import { motion } from "framer-motion"
import DOMPurify from "dompurify"

// Types
interface ForumPost {
  id: string
  topicId: string
  author: string
  authorAvatar: string
  authorRole: string
  authorJoined: string
  authorPosts: number
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  isEdited: boolean
}

interface ForumTopic {
  id: string
  title: string
  categoryId: string
  author: string
  authorAvatar: string
  createdAt: string
  views: number
  replies: number
  isPinned: boolean
  isLocked: boolean
  isSolved?: boolean
  tags: string[]
}

// Main ForumTopicView Component
const ForumTopicView: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportPostId, setReportPostId] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  // Sample data - in a real app, this would come from an API
  const sampleTopics = useMemo<ForumTopic[]>(
    () => [
      {
        id: "topic1",
        title: "Willkommen im LifeVerse Forum - Bitte lesen!",
        categoryId: "general",
        author: "Admin",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        createdAt: "01.01.2025",
        views: 15243,
        replies: 87,
        isPinned: true,
        isLocked: false,
        tags: ["Wichtig", "Regeln"],
      },
      {
        id: "topic2",
        title: "Neue Features in Version 2.5 - Diskussion",
        categoryId: "general",
        author: "MaxMustermann",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        createdAt: "09.03.2025",
        views: 1243,
        replies: 42,
        isPinned: true,
        isLocked: false,
        tags: ["Update", "Features"],
      },
      {
        id: "topic3",
        title: "Probleme mit dem Login nach dem Update",
        categoryId: "technical",
        author: "TechGuru",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        createdAt: "08.03.2025",
        views: 876,
        replies: 23,
        isPinned: false,
        isLocked: false,
        isSolved: true,
        tags: ["Bug", "Login"],
      },
    ],
    [],
  )

  const samplePosts = useMemo<ForumPost[]>(
    () => [
      {
        id: "post1",
        topicId: "topic2",
        author: "MaxMustermann",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "Mitglied",
        authorJoined: "Januar 2023",
        authorPosts: 342,
        content: `<p>Hallo zusammen!</p>
               <p>Mit dem neuesten Update 2.5 wurden einige spannende Features eingeführt, die ich hier gerne mit euch diskutieren möchte:</p>
               <ul>
                  <li><strong>Neues Crafting-System</strong> - Jetzt mit mehr Rezepten und besserer Benutzeroberfläche</li>
                  <li><strong>Überarbeitete Grafik</strong> - Besonders in den Waldgebieten sieht es jetzt viel realistischer aus</li>
                  <li><strong>Neue Quests</strong> - 15 neue Hauptquests und über 30 Nebenquests wurden hinzugefügt</li>
               </ul>
               <p>Was haltet ihr von den Änderungen? Ich bin besonders vom neuen Crafting-System begeistert!</p>`,
        createdAt: "09.03.2025, 15:30",
        likes: 24,
        isLiked: false,
        isEdited: false,
      },
      {
        id: "post2",
        topicId: "topic2",
        author: "GameFan22",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "Erfahrener Spieler",
        authorJoined: "März 2023",
        authorPosts: 567,
        content: `<p>Danke für die Zusammenfassung, Max!</p>
               <p>Ich habe das Update gestern ausprobiert und bin wirklich beeindruckt. Die Grafik-Überarbeitung ist fantastisch, besonders die neuen Lichteffekte in den Höhlen sind atemberaubend.</p>
               <p>Allerdings habe ich ein kleines Problem mit dem Crafting-System gefunden: Wenn man mehr als 50 Gegenstände gleichzeitig herstellen will, friert das Spiel manchmal kurz ein. Hat das noch jemand bemerkt?</p>`,
        createdAt: "09.03.2025, 16:45",
        likes: 12,
        isLiked: true,
        isEdited: true,
      },
      {
        id: "post3",
        topicId: "topic2",
        author: "DevTeamMember",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "Entwickler",
        authorJoined: "Dezember 2022",
        authorPosts: 189,
        content: `<p>Hallo zusammen,</p>
               <p>vielen Dank für euer Feedback zum Update 2.5! Wir freuen uns, dass die neuen Features gut ankommen.</p>
               <p>@GameFan22: Danke für den Hinweis zum Crafting-System. Dieses Problem ist uns bekannt und wir arbeiten bereits an einem Hotfix, der in den nächsten Tagen veröffentlicht werden soll.</p>
               <p>Falls ihr weitere Bugs oder Probleme entdeckt, meldet sie bitte im Bereich "Technischer Support" oder direkt über die In-Game-Funktion.</p>`,
        createdAt: "09.03.2025, 18:20",
        likes: 45,
        isLiked: false,
        isEdited: false,
      },
    ],
    [],
  )

  // Fetch topic and posts data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const foundTopic = sampleTopics.find((t) => t.id === topicId)
      const topicPosts = samplePosts.filter((p) => p.topicId === topicId)

      if (foundTopic) {
        setTopic(foundTopic)
        setPosts(topicPosts)
      } else {
        // Topic not found, redirect to forum
        navigate("/forum")
      }

      setIsLoading(false)
    }, 500)
  }, [topicId, navigate, sampleTopics, samplePosts])

  // Handle post like
  const handleLikePost = (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login?redirect=forum")
      return
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      }),
    )
  }

  // Handle reply submission
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate("/login?redirect=forum")
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newPost: ForumPost = {
        id: `post${Date.now()}`,
        topicId: topicId || "",
        author: user?.username || "Anonymous",
        authorAvatar: user?.profilePicture || "/placeholder.svg?height=40&width=40",
        authorRole: "Mitglied",
        authorJoined: "März 2025",
        authorPosts: 1,
        content: replyContent.replace(/\n/g, "<br>"),
        createdAt: new Date().toLocaleString("de-DE"),
        likes: 0,
        isLiked: false,
        isEdited: false,
      }

      setPosts((prevPosts) => [...prevPosts, newPost])
      setReplyContent("")
      setIsSubmitting(false)

      // Scroll to the new post
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        })
      }, 100)
    }, 1000)
  }

  // Handle report post
  const handleReportPost = (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login?redirect=forum")
      return
    }

    setReportPostId(postId)
    setIsReportModalOpen(true)
  }

  // Handle submit report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    console.log({
      postId: reportPostId,
      reason: reportReason,
      description: reportDescription,
    })

    // Reset and close modal
    setReportReason("")
    setReportDescription("")
    setReportPostId(null)
    setIsReportModalOpen(false)
  }

  // Handle edit post
  const handleEditPost = (post: ForumPost) => {
    if (!isAuthenticated) return

    setEditingPostId(post.id)
    setEditContent(post.content.replace(/<br>/g, "\n").replace(/<[^>]*>/g, ""))
  }

  // Handle save edit
  const handleSaveEdit = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            content: editContent.replace(/\n/g, "<br>"),
            isEdited: true,
          }
        }
        return post
      }),
    )

    setEditingPostId(null)
    setEditContent("")
  }

  // Handle delete post
  const handleDeletePost = (postId: string) => {
    if (window.confirm("Bist du sicher, dass du diesen Beitrag löschen möchtest?")) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    }
  }

  // Handle mark as solution
  const handleMarkAsSolution = (postId: string) => {
    if (topic) {
      setTopic({
        ...topic,
        isSolved: true,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Lade Thema...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-amber-600 dark:text-amber-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Thema nicht gefunden</p>
          <Link
            to="/forum"
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
          >
            Zurück zum Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-300/10 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-12 -left-24 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Topic Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link
              to="/forum"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück zum Forum
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    {topic.isPinned && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <Pin className="h-3 w-3 mr-1" />
                        Angepinnt
                      </span>
                    )}
                    {topic.isLocked && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                        <Lock className="h-3 w-3 mr-1" />
                        Geschlossen
                      </span>
                    )}
                    {topic.isSolved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Gelöst
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{topic.title}</h1>

                  <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-2">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {topic.createdAt}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-3.5 w-3.5 mr-1" />
                      {posts.length} Beiträge
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      {topic.views} Aufrufe
                    </span>
                    <span className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Erstellt von{" "}
                      <span className="font-medium text-gray-900 dark:text-white ml-1">{topic.author}</span>
                    </span>
                  </div>

                  {/* Tags */}
                  {topic.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topic.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                {user?.role === "Admin" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setTopic({
                          ...topic,
                          isPinned: !topic.isPinned,
                        })
                      }}
                      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      title={topic.isPinned ? "Nicht mehr anpinnen" : "Anpinnen"}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setTopic({
                          ...topic,
                          isLocked: !topic.isLocked,
                        })
                      }}
                      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      title={topic.isLocked ? "Entsperren" : "Sperren"}
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              id={`post-${post.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Author Info */}
                  <div className="md:w-48 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-6">
                    <div className="flex-shrink-0">
                      <img
                        src={post.authorAvatar || "/placeholder.svg"}
                        alt={post.author}
                        className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{post.author}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{post.authorRole}</p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                        <p className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Mitglied seit {post.authorJoined}
                        </p>
                        <p className="flex items-center mt-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.authorPosts} Beiträge
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {post.createdAt}
                        {post.isEdited && <span className="ml-2 text-xs">(bearbeitet)</span>}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center space-x-1">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`p-1.5 rounded-lg flex items-center text-sm transition-colors duration-200 ${
                            post.isLiked
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </button>

                        {/* Reply Button */}
                        <button
                          onClick={() => {
                            if (topic.isLocked) return

                            // Focus on reply textarea
                            const replyTextarea = document.getElementById("reply-textarea")
                            if (replyTextarea) {
                              replyTextarea.scrollIntoView({ behavior: "smooth" })
                              replyTextarea.focus()
                              setReplyContent((prev) => prev + (prev ? "\n\n" : "") + `@${post.author} `)
                            }
                          }}
                          className={`p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 ${
                            topic.isLocked ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={topic.isLocked}
                        >
                          <Reply className="h-4 w-4" />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => {
                            const url = `${window.location.href}#post-${post.id}`
                            navigator.clipboard.writeText(url)
                            alert("Link zum Beitrag kopiert!")
                          }}
                          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        {/* Report Button */}
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                          <Flag className="h-4 w-4" />
                        </button>

                        {/* More Actions */}
                        {(user?.username === post.author || user?.role === "Admin" || user?.role === "Moderator") && (
                          <div className="relative group">
                            <button className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                              {user?.username === post.author && (
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Bearbeiten
                                </button>
                              )}
                              {(user?.username === post.author ||
                                user?.role === "Admin" ||
                                user?.role === "Moderator") && (
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Löschen
                                </button>
                              )}
                              {(user?.username === topic.author ||
                                user?.role === "Admin" ||
                                user?.role === "Moderator") &&
                                index > 0 &&
                                !topic.isSolved && (
                                  <button
                                    onClick={() => handleMarkAsSolution(post.id)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-left text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Als Lösung markieren
                                  </button>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    {editingPostId === post.id ? (
                      <div className="mt-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={6}
                        ></textarea>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingPostId(null)
                              setEditContent("")
                            }}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Abbrechen
                          </button>
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Speichern
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="mt-4 prose prose-blue dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {!topic.isLocked ? (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Antworten</h3>

              {isAuthenticated ? (
                <form onSubmit={handleSubmitReply}>
                  <textarea
                    id="reply-textarea"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Schreibe deine Antwort..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    required
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Antworten
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Du musst angemeldet sein, um auf dieses Thema zu antworten.
                  </p>
                  <Link
                    to="/login?redirect=forum"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 inline-block"
                  >
                    Anmelden
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
            <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Dieses Thema ist geschlossen</h3>
            <p className="text-gray-600 dark:text-gray-400">Es können keine neuen Antworten mehr hinzugefügt werden.</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>
            </div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
            >
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Beitrag melden</h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setIsReportModalOpen(false)}
                      >
                        <span className="sr-only">Schließen</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmitReport} className="space-y-4">
                      <div>
                        <label
                          htmlFor="report-reason"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Grund
                        </label>
                        <select
                          id="report-reason"
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Grund auswählen</option>
                          <option value="spam">Spam</option>
                          <option value="inappropriate">Unangemessener Inhalt</option>
                          <option value="harassment">Belästigung</option>
                          <option value="misinformation">Falschinformation</option>
                          <option value="other">Sonstiges</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="report-description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Beschreibung
                        </label>
                        <textarea
                          id="report-description"
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        ></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <motion.button
                  whileHover={{ y: -2 }}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmitReport}
                >
                  Melden
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Abbrechen
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumTopicView

