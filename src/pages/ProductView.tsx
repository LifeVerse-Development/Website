"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { addItem } from "../stores/cartSlice"
import type { RootState } from "../stores/store"
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Check,
  Info,
  Shield,
  Truck,
  RefreshCw,
  ChevronRight,
  MessageSquare,
} from "lucide-react"

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
  details?: string[]
  specifications?: { [key: string]: string }
}

const products: Product[] = [
  {
    id: 1,
    name: "LifeVerse Premium Pass",
    description:
      "Freischaltung exklusiver Features und Belohnungen. Der Premium Pass bietet dir Zugang zu allen Premium-Inhalten und Funktionen in LifeVerse. Genieße exklusive Events, besondere Belohnungen und einzigartige Vorteile, die nur Premium-Mitgliedern zur Verfügung stehen.",
    price: 29.99,
    image: "https://fakeimg.pl/600x400",
    category: "Subscriptions",
    rating: 4.8,
    featured: true,
    details: [
      "Zugang zu allen Premium-Bereichen",
      "Monatliche exklusive Belohnungen",
      "Prioritäts-Support",
      "Keine Werbung",
      "Exklusive In-Game-Events",
    ],
    specifications: {
      Laufzeit: "30 Tage",
      "Automatische Verlängerung": "Ja (kann deaktiviert werden)",
      Aktivierung: "Sofort nach Kauf",
      Plattformen: "PC, Mobile, Console",
    },
  },
  {
    id: 2,
    name: "In-Game Währung (10.000 Coins)",
    description:
      "Nutze Coins für besondere Items und Upgrades. Mit dieser Währung kannst du im Spiel verschiedene Gegenstände, Upgrades und kosmetische Anpassungen erwerben. Ein Muss für jeden Spieler, der schneller vorankommen möchte.",
    price: 9.99,
    image: "https://fakeimg.pl/600x400",
    category: "Currency",
    rating: 4.5,
    details: ["10.000 Coins werden sofort gutgeschrieben", "Verwendbar für alle In-Game-Käufe", "Kein Verfallsdatum"],
    specifications: {
      Menge: "10.000 Coins",
      Bonus: "500 Coins (5% Bonus)",
      Aktivierung: "Sofort nach Kauf",
      Plattformen: "PC, Mobile, Console",
    },
  },
  {
    id: 3,
    name: "Exklusive Fahrzeug-Skins",
    description:
      "Personalisiere dein Fahrzeug mit einzigartigen Designs. Diese Sammlung enthält 5 exklusive Fahrzeug-Skins, die deinen Fahrzeugen ein einzigartiges Aussehen verleihen. Zeige deinen Stil und hebe dich von der Masse ab.",
    price: 4.99,
    image: "https://fakeimg.pl/600x400",
    category: "Cosmetics",
    rating: 4.2,
    details: [
      "5 einzigartige Fahrzeug-Designs",
      "Hohe Auflösung und Detailgrad",
      "Anpassbar für alle Fahrzeugtypen",
      "Exklusiv für dieses Paket",
    ],
    specifications: {
      Anzahl: "5 Skins",
      Kompatibilität: "Alle Fahrzeugtypen",
      Seltenheit: "Episch",
      Aktivierung: "Sofort nach Kauf",
    },
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
]

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currency } = useSelector((state: RootState) => state.preferences)

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description")

  const product = products.find((p) => p.id === Number(id))

  // Related products (excluding current product)
  const relatedProducts = products
    .filter((p) => p.id !== Number(id) && (p.category === product?.category || p.featured))
    .slice(0, 3)

  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  }

  const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.EUR

  if (!product) {
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
              Produkt nicht gefunden
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
              Das gesuchte Produkt existiert nicht oder wurde entfernt.
            </p>
            <button
              onClick={() => navigate("/store")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Zurück zum Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const productPrice = (product.price * exchangeRate).toFixed(2)

  const addToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      }),
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <a href="/store" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Store
                </a>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <a
                  href={`/store/${product.category.toLowerCase()}`}
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {product.category}
                </a>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-xs">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={product.image || `/placeholder.svg?height=600&width=600`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.new && (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Neu</span>
                      )}
                      {product.featured && (
                        <span className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                          Empfohlen
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnails - Placeholder for multiple images */}
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                          index === 0 ? "border-blue-500 dark:border-blue-400" : "border-transparent"
                        }`}
                      >
                        <img
                          src={product.image || `/placeholder.svg?height=100&width=100`}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Features */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Produktmerkmale</h3>

                  <ul className="space-y-3">
                    {product.details ? (
                      product.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-300">{detail}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Hohe Qualität</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Sofortige Aktivierung</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="ml-3 text-gray-700 dark:text-gray-300">Exklusives Design</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden sticky top-24">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="mb-1">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{product.category}</span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {product.rating.toFixed(1)} (127 Bewertungen)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {productPrice} {currency}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inkl. MwSt. • Sofortige Lieferung</p>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Menge</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="w-16 px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>In den Warenkorb</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="hidden sm:inline">Merken</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="hidden sm:inline">Teilen</span>
                    </motion.button>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sofortige Lieferung</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Direkt nach dem Kauf</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sicherer Kauf</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Verschlüsselte Transaktion</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Support</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">24/7 Kundenservice</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Rückerstattung</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">14 Tage Geld-zurück</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "description"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Beschreibung
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "specifications"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Spezifikationen
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Bewertungen
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose prose-blue max-w-none dark:prose-invert prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">Über dieses Produkt</h3>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Erlebe LifeVerse wie nie zuvor mit diesem exklusiven Produkt. Entwickelt für Spieler, die das Beste
                    aus ihrem Spielerlebnis herausholen möchten, bietet {product.name} eine Vielzahl von Vorteilen und
                    Funktionen.
                  </p>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    Unser Team hat unermüdlich daran gearbeitet, ein Produkt zu entwickeln, das nicht nur funktional,
                    sondern auch ästhetisch ansprechend ist. Jedes Detail wurde sorgfältig durchdacht, um
                    sicherzustellen, dass du das bestmögliche Erlebnis hast.
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technische Details</h3>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {product.specifications ? (
                          Object.entries(product.specifications).map(([key, value], index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {key}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {value}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                Typ
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                Digital
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                Aktivierung
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                Sofort nach Kauf
                              </td>
                            </tr>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                Plattformen
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                PC, Mobile, Console
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Systemanforderungen</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Minimum</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>LifeVerse Basisspiel</li>
                        <li>Aktives Spielkonto</li>
                        <li>Internetverbindung</li>
                        <li>2 GB freier Speicherplatz</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Empfohlen</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>LifeVerse Basisspiel (neueste Version)</li>
                        <li>Premium-Spielkonto</li>
                        <li>Stabile Internetverbindung</li>
                        <li>5 GB freier Speicherplatz</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Kundenbewertungen</h3>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Bewertung schreiben
                    </button>
                  </div>

                  <div className="flex items-center mb-8">
                    <div className="flex-shrink-0 mr-6">
                      <p className="text-5xl font-bold text-gray-900 dark:text-white">{product.rating.toFixed(1)}</p>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Basierend auf 127 Bewertungen</p>
                    </div>

                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage =
                          rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                        return (
                          <div key={rating} className="flex items-center mb-2">
                            <div className="flex items-center mr-2">
                              <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">{rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div className="h-2 bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{percentage}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        name: "Max Mustermann",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 5,
                        date: "15.03.2023",
                        title: "Absolut empfehlenswert!",
                        comment:
                          "Eines der besten Produkte, die ich je gekauft habe. Die Qualität ist hervorragend und der Preis ist angemessen. Würde es jederzeit wieder kaufen.",
                      },
                      {
                        name: "Anna Schmidt",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 4,
                        date: "02.02.2023",
                        title: "Sehr gutes Produkt mit kleinen Mängeln",
                        comment:
                          "Ich bin insgesamt sehr zufrieden mit dem Produkt. Es gibt ein paar kleine Dinge, die verbessert werden könnten, aber nichts, was mich davon abhalten würde, es zu empfehlen.",
                      },
                      {
                        name: "Thomas Müller",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 5,
                        date: "18.01.2023",
                        title: "Perfekt für meine Bedürfnisse",
                        comment:
                          "Genau das, was ich gesucht habe. Die Funktionen sind genau wie beschrieben und die Benutzerfreundlichkeit ist top. Sehr zufrieden mit meinem Kauf.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                        <div className="flex items-start">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            className="w-10 h-10 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{review.name}</h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex mt-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">{review.title}</h5>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                            <div className="flex items-center mt-3 space-x-4">
                              <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Antworten
                              </button>
                              <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <Heart className="h-4 w-4 mr-1" />
                                Hilfreich
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Alle Bewertungen anzeigen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Das könnte dir auch gefallen</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/store/${relatedProduct.id}`)}
                >
                  <div className="relative">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={relatedProduct.image || `/placeholder.svg?height=200&width=400`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {relatedProduct.new && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">Neu</span>
                      )}
                      {relatedProduct.featured && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                          Empfohlen
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-1">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {relatedProduct.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedProduct.name}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        {relatedProduct.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {(relatedProduct.price * exchangeRate).toFixed(2)} {currency}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(
                            addItem({
                              id: relatedProduct.id,
                              name: relatedProduct.name,
                              price: relatedProduct.price,
                              image: relatedProduct.image,
                              quantity: 1,
                            }),
                          )
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductView

