"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { addItem } from "../stores/cartSlice"
import { setQuery } from "../stores/searchSlice"
import type { RootState } from "../stores/store"
import { Search, ShoppingCart, Filter, ChevronDown, Tag, Star, Clock, Check } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  featured?: boolean
  new?: boolean
}

const products: Product[] = [
  {
    id: 1,
    name: "LifeVerse Premium Pass",
    description: "Freischaltung exklusiver Features und Belohnungen.",
    price: 29.99,
    image: "https://fakeimg.pl/600x400",
    category: "Subscriptions",
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    name: "In-Game Währung (10.000 Coins)",
    description: "Nutze Coins für besondere Items und Upgrades.",
    price: 9.99,
    image: "https://fakeimg.pl/600x400",
    category: "Currency",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Exklusive Fahrzeug-Skins",
    description: "Personalisiere dein Fahrzeug mit einzigartigen Designs.",
    price: 4.99,
    image: "https://fakeimg.pl/600x400",
    category: "Cosmetics",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Legendäres Waffenpaket",
    description: "Sammlung seltener Waffen mit einzigartigen Fähigkeiten.",
    price: 19.99,
    image: "https://fakeimg.pl/600x400",
    category: "Weapons",
    rating: 4.7,
    new: true,
  },
  {
    id: 5,
    name: "Charakter-Boost",
    description: "Beschleunige deinen Fortschritt mit diesem Boost-Paket.",
    price: 14.99,
    image: "https://fakeimg.pl/600x400",
    category: "Boosters",
    rating: 4.3,
  },
  {
    id: 6,
    name: "Exklusive Emotes",
    description: "Drücke dich mit einzigartigen Animationen aus.",
    price: 2.99,
    image: "https://fakeimg.pl/600x400",
    category: "Cosmetics",
    rating: 4.0,
  },
  {
    id: 7,
    name: "Saisonpass: Sommer",
    description: "Zugang zu allen Sommerevents und exklusiven Belohnungen.",
    price: 24.99,
    image: "https://fakeimg.pl/600x400",
    category: "Subscriptions",
    rating: 4.6,
    featured: true,
  },
  {
    id: 8,
    name: "Haustier-Begleiter",
    description: "Süße Begleiter, die dir auf deinen Abenteuern folgen.",
    price: 7.99,
    image: "https://fakeimg.pl/600x400",
    category: "Companions",
    rating: 4.9,
    new: true,
  },
]

// Categories derived from products
const categories = Array.from(new Set(products.map((product) => product.category)))

const Store: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchQuery = useSelector((state: RootState) => state.search.query)
  const { currency } = useSelector((state: RootState) => state.preferences)

  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortOption, setSortOption] = useState<string>("featured")
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  }

  const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.EUR

  // Apply filters and search
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)

      // Price filter
      const productPrice = product.price * exchangeRate
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      // Sort products
      switch (sortOption) {
        case "price-low":
          return a.price * exchangeRate - b.price * exchangeRate
        case "price-high":
          return b.price * exchangeRate - a.price * exchangeRate
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.new ? 1 : 0) - (a.new ? 1 : 0)
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })
    .map((product) => ({
      ...product,
      priceInSelectedCurrency: product.price * exchangeRate,
    }))

  const addToCart = (product: Product) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setQuery(localSearchQuery))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 50])
    setSortOption("featured")
    dispatch(setQuery(""))
    setLocalSearchQuery("")
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

        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              LifeVerse Store
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Entdecke exklusive Items, Upgrades und Erweiterungen für dein LifeVerse-Erlebnis.
            </p>
          </div>

          {/* Search and Cart */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Suche nach Produkten..."
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-2.5 p-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Filter & Sortierung</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block lg:w-1/4`}>
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter</h2>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Zurücksetzen
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Kategorien</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <button
                            onClick={() => toggleCategory(category)}
                            className={`flex items-center justify-center w-5 h-5 rounded ${selectedCategories.includes(category)
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 dark:border-gray-600"
                              }`}
                          >
                            {selectedCategories.includes(category) && <Check className="h-3 w-3" />}
                          </button>
                          <span className="ml-3 text-gray-700 dark:text-gray-300">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Preis</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {priceRange[0]} - {priceRange[1]} {currency}
                      </span>
                    </div>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="1"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Math.min(500, Number.parseInt(e.target.value))])
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sortieren nach</h3>
                    <div className="space-y-2">
                      {[
                        { value: "featured", label: "Empfohlen", icon: <Star className="h-4 w-4" /> },
                        { value: "price-low", label: "Preis: Niedrig zu Hoch", icon: <Tag className="h-4 w-4" /> },
                        { value: "price-high", label: "Preis: Hoch zu Niedrig", icon: <Tag className="h-4 w-4" /> },
                        { value: "rating", label: "Bewertung", icon: <Star className="h-4 w-4" /> },
                        { value: "newest", label: "Neueste", icon: <Clock className="h-4 w-4" /> },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortOption(option.value)}
                          className={`flex items-center w-full px-3 py-2 rounded-lg ${sortOption === option.value
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                          <span className="mr-2">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">{filteredProducts.length} Produkte gefunden</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Anzeigen:</span>
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-2 py-1"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Empfohlen</option>
                  <option value="price-low">Preis: Niedrig zu Hoch</option>
                  <option value="price-high">Preis: Hoch zu Niedrig</option>
                  <option value="rating">Bewertung</option>
                  <option value="newest">Neueste</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/store/${product.id}`)}
                  >
                    <div className="relative">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={product.image || `/placeholder.svg?height=200&width=400`}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.new && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            Neu
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                            Empfohlen
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-1">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{product.category}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {product.priceInSelectedCurrency.toFixed(2)} {currency}
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span className="text-sm">Hinzufügen</span>
                        </motion.button>
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Keine Produkte gefunden</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Versuche andere Suchbegriffe oder Filter.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Beliebte Kollektionen</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Pakete",
                description: "Exklusive Bundles mit besonderen Vorteilen",
                image: "https://fakeimg.pl/600x400",
                color: "from-blue-500 to-purple-500",
              },
              {
                title: "Saisonale Items",
                description: "Limitierte Angebote für besondere Ereignisse",
                image: "https://fakeimg.pl/600x400",
                color: "from-amber-500 to-red-500",
              },
              {
                title: "Starter Kits",
                description: "Perfekt für neue Spieler",
                image: "https://fakeimg.pl/600x400",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((collection, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer"
              >
                <div className={`h-2 bg-gradient-to-r ${collection.color}`}></div>
                <div className="p-6">
                  <div className="h-40 rounded-xl overflow-hidden mb-4">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{collection.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{collection.description}</p>
                  <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    Entdecken →
                  </button>
                </div>
              </motion.div>
            ))}
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
                  Erhalte Benachrichtigungen über neue Produkte, Sonderangebote und Events.
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

export default Store

