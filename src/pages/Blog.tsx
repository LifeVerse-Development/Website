"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, Calendar, ArrowRight, Tag } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  description: string
  image: string
  date: string
  category: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Willkommen in LifeVerse!",
    description:
      "Erfahre alles über das kommende 1:1-Spiel zum echten Leben. Wir stellen dir unser revolutionäres Konzept vor und zeigen dir, wie LifeVerse das Gaming neu definieren wird.",
    image: "https://fakeimg.pl/600x400?text=LifeVerse",
    date: "05. März 2025",
    category: "Ankündigungen",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Gameplay-Mechaniken enthüllt",
    description:
      "Ein detaillierter Blick auf die Spielmechaniken und Features. Entdecke, wie wir das echte Leben in einer virtuellen Welt nachbilden und welche Möglichkeiten dir zur Verfügung stehen werden.",
    image: "https://fakeimg.pl/600x400?text=Gameplay",
    date: "20. Februar 2025",
    category: "Features",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "Roadmap 2025",
    description:
      "Was euch in LifeVerse erwartet: Alle geplanten Updates und Erweiterungen für das kommende Jahr. Wir geben einen Ausblick auf neue Berufe, Wohngebiete und soziale Features.",
    image: "https://fakeimg.pl/600x400?text=Roadmap",
    date: "10. Januar 2025",
    category: "Entwicklung",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Community Spotlight: Die ersten Tester",
    description:
      "Wir stellen euch die ersten Spieler vor, die LifeVerse testen durften. Erfahrt, was sie über ihre Erfahrungen berichten und welche Aspekte des Spiels sie am meisten begeistert haben.",
    image: "https://fakeimg.pl/600x400?text=Community",
    date: "28. Dezember 2024",
    category: "Community",
    readTime: "7 min",
  },
  {
    id: 5,
    title: "Karrieremöglichkeiten in LifeVerse",
    description:
      "Entdecke die vielfältigen Berufswege, die dir in LifeVerse offenstehen. Von traditionellen Karrieren bis hin zu kreativen Berufen - in unserer virtuellen Welt kannst du jeden Weg einschlagen.",
    image: "https://fakeimg.pl/600x400?text=Karriere",
    date: "15. Dezember 2024",
    category: "Features",
    readTime: "10 min",
  },
  {
    id: 6,
    title: "Interview mit dem Entwicklerteam",
    description:
      "Ein exklusives Gespräch mit den Köpfen hinter LifeVerse. Erfahre mehr über die Inspiration, Herausforderungen und Visionen der Entwickler für die Zukunft des Spiels.",
    image: "https://fakeimg.pl/600x400?text=Interview",
    date: "01. Dezember 2024",
    category: "Hinter den Kulissen",
    readTime: "12 min",
  },
]

const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

const Blog: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts[0]

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

      {/* Featured Post */}
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
                src={featuredPost.image || "/placeholder.svg"}
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
                  onClick={() => navigate(`/news/${featuredPost.id}`)}
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

      {/* Blog Posts Grid */}
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

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/news/${post.id}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
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

      {/* Categories Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Kategorien</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const count = blogPosts.filter((post) => post.category === category).length
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
                <form className="sm:flex">
                  <label htmlFor="email-address" className="sr-only">
                    E-Mail-Adresse
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                    placeholder="Deine E-Mail-Adresse"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                    >
                      Abonnieren
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-blue-100">
                  Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Blog

