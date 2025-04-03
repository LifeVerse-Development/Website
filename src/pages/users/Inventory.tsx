"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import InventoryItem, { type IInventoryItem as IInventoryItemType } from "./InventoryItem"
import axios from "axios"
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Loader,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

// Define types for our data structures
interface User {
  id: number
  username: string
  gold: number
  avatar?: string
}

interface Player {
  id: number
  username: string
  avatar?: string
}

interface NotificationState {
  show: boolean
  message: string
  type: "success" | "error" | "info" | ""
}

// Define rarity order as a Record type with specific keys
const rarityOrder: Record<"Common" | "Uncommon" | "Rare" | "Epic" | "Legendary", number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
}

export const Inventory = () => {
  const [inventory, setInventory] = useState<IInventoryItemType[]>([])
  const [selectedItem, setSelectedItem] = useState<IInventoryItemType | null>(null)
  const [sellQuantity, setSellQuantity] = useState<number>(1)
  const [tradeQuantity, setTradeQuantity] = useState<number>(1)
  const [tradePartner, setTradePartner] = useState<Player | null>(null)
  const [tradeOffer, setTradeOffer] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("inventory")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<string>("asc")
  const [filterType, setFilterType] = useState<string>("all")
  const [user, setUser] = useState<User | null>(null)
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([])
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: "", type: "" })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(12)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile")
        setUser(response.data)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try again later.")
      }
    }

    fetchUserData()
  }, [])

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true)
      setError(null)
  
      try {
        // If sorting by rarity, handle it client-side due to custom ordering
        if (sortBy === "rarity") {
          const response = await axios.get("/api/inventory", {
            params: {
              page,
              limit: itemsPerPage,
              type: filterType !== "all" ? filterType : undefined,
              search: searchTerm || undefined,
            },
          })
  
          let items = response.data.items
  
          items = items.sort((a: any, b: any) => {
            const rarityA = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0
            const rarityB = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0
          
            return sortOrder === "asc" ? rarityA - rarityB : rarityB - rarityA
          })
  
          setInventory(items)
          setTotalPages(response.data.totalPages)
        } else {
          // For other sort types, let the server handle sorting
          const response = await axios.get("/api/inventory", {
            params: {
              page,
              limit: itemsPerPage,
              sort: sortBy,
              order: sortOrder,
              type: filterType !== "all" ? filterType : undefined,
              search: searchTerm || undefined,
            },
          })
  
          setInventory(response.data.items)
          setTotalPages(response.data.totalPages)
        }
  
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching inventory:", err)
        setError("Failed to load inventory. Please try again later.")
        setIsLoading(false)
      }
    }
  
    fetchInventory()
  }, [page, itemsPerPage, sortBy, sortOrder, filterType, searchTerm])  

  // Fetch other players for trading
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("/api/players")
        setOtherPlayers(response.data)
      } catch (err) {
        console.error("Error fetching players:", err)
        // Don't set error state here as it's not critical
      }
    }

    if (activeTab === "trade") {
      fetchPlayers()
    }
  }, [activeTab])

  // Handle item selection
  const handleSelectItem = (item: IInventoryItemType) => {
    setSelectedItem(item)
    setSellQuantity(1)
    setTradeQuantity(1)
  }

  // Handle selling items
  const handleSellItem = async () => {
    if (!selectedItem) return

    try {
      setIsLoading(true)

      const response = await axios.post("/api/inventory/sell", {
        itemId: selectedItem.id,
        quantity: sellQuantity,
      })

      // Update user gold from response
      if (user) {
        setUser({
          ...user,
          gold: response.data.newGoldAmount,
        })
      }

      // Refresh inventory after selling
      const inventoryResponse = await axios.get("/api/inventory", {
        params: {
          page,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder,
          type: filterType !== "all" ? filterType : undefined,
          search: searchTerm || undefined,
        },
      })

      setInventory(inventoryResponse.data.items)
      setTotalPages(inventoryResponse.data.totalPages)

      setSelectedItem(null)
      showNotification(
        `Successfully sold ${sellQuantity} ${selectedItem.name} for ${selectedItem.value * sellQuantity} gold!`,
        "success",
      )
    } catch (err) {
      console.error("Error selling item:", err)
      showNotification("Failed to sell item. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle trading items
  const handleTradeItem = async () => {
    if (!selectedItem || !tradePartner) return

    try {
      setIsLoading(true)

      await axios.post("/api/inventory/trade", {
        itemId: selectedItem.id,
        quantity: tradeQuantity,
        partnerId: tradePartner.id,
        message: tradeOffer,
      })

      // Refresh inventory after trading
      const inventoryResponse = await axios.get("/api/inventory", {
        params: {
          page,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder,
          type: filterType !== "all" ? filterType : undefined,
          search: searchTerm || undefined,
        },
      })

      setInventory(inventoryResponse.data.items)
      setTotalPages(inventoryResponse.data.totalPages)

      setSelectedItem(null)
      showNotification(`Trade offer sent to ${tradePartner.username}!`, "success")
    } catch (err) {
      console.error("Error trading item:", err)
      showNotification("Failed to send trade offer. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Handle refresh inventory
  const handleRefreshInventory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get("/api/inventory", {
        params: {
          page,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder,
          type: filterType !== "all" ? filterType : undefined,
          search: searchTerm || undefined,
        },
      })

      setInventory(response.data.items)
      setTotalPages(response.data.totalPages)
      showNotification("Inventory refreshed successfully!", "info")
    } catch (err) {
      console.error("Error refreshing inventory:", err)
      setError("Failed to refresh inventory. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique item types from inventory for filter dropdown
  const itemTypes = Array.from(new Set(inventory.map((item) => item.type)))

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16 transition-colors duration-200">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                    Inventory
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">
                    Manage your items, sell them, or trade with other players.
                  </p>
                </div>

                {/* User Profile Summary */}
                {user && (
                  <div className="mt-4 md:mt-0 flex items-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=40&width=40"
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                        <span className="text-yellow-900 dark:text-yellow-100 font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">{user.username}</p>
                      <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                        {user.gold.toLocaleString()} gold
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <button
                className={`px-6 py-3 font-medium transition-colors duration-200 ${
                  activeTab === "inventory"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("inventory")}
              >
                Inventory
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors duration-200 ${
                  activeTab === "sell"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("sell")}
              >
                Sell Items
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors duration-200 ${
                  activeTab === "trade"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("trade")}
              >
                Trade
              </button>
            </div>

            <div className="p-6">
              {/* Inventory Tab */}
              {activeTab === "inventory" && (
                <div>
                  {/* Search and Filter */}
                  <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 appearance-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        {itemTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {sortOrder === "asc" ? (
                          <SortAsc className="h-4 w-4 text-gray-400" />
                        ) : (
                          <SortDesc className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <select
                        className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 appearance-none"
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [newSortBy, newSortOrder] = e.target.value.split("-")
                          setSortBy(newSortBy)
                          setSortOrder(newSortOrder)
                        }}
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="value-asc">Value (Low to High)</option>
                        <option value="value-desc">Value (High to Low)</option>
                        <option value="rarity-asc">Rarity (Common to Legendary)</option>
                        <option value="rarity-desc">Rarity (Legendary to Common)</option>
                        <option value="quantity-asc">Quantity (Low to High)</option>
                        <option value="quantity-desc">Quantity (High to Low)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <button
                      onClick={handleRefreshInventory}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-center items-center py-12">
                      <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                      <span className="ml-2 text-gray-600 dark:text-gray-300">Loading inventory...</span>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !isLoading && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoading && !error && inventory.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No items found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm || filterType !== "all"
                          ? "Try adjusting your search or filters"
                          : "Your inventory is empty. Visit the store to purchase items."}
                      </p>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          setSearchTerm("")
                          setFilterType("all")
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}

                  {/* Inventory Grid */}
                  {!isLoading && !error && inventory.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {inventory.map((item) => (
                          <InventoryItem
                            key={item.id}
                            item={item}
                            isSelected={selectedItem?.id === item.id}
                            onSelect={handleSelectItem}
                            onSell={() => {
                              setSelectedItem(item)
                              setActiveTab("sell")
                            }}
                            onTrade={() => {
                              setSelectedItem(item)
                              setActiveTab("trade")
                            }}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
                          <div className="mb-4 sm:mb-0 flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Items per page:</span>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                const newItemsPerPage = Number(e.target.value)
                                setItemsPerPage(newItemsPerPage)
                                setPage(1) // Reset to first page when changing items per page
                              }}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value={8}>8</option>
                              <option value={12}>12</option>
                              <option value={24}>24</option>
                              <option value={48}>48</option>
                            </select>
                          </div>

                          <nav className="flex items-center space-x-2">
                            <button
                              onClick={() => setPage(Math.max(1, page - 1))}
                              disabled={page === 1}
                              className={`p-2 rounded-md ${
                                page === 1
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-1 rounded-md ${
                                  pageNum === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                              >
                                {pageNum}
                              </button>
                            ))}

                            <button
                              onClick={() => setPage(Math.min(totalPages, page + 1))}
                              disabled={page === totalPages}
                              className={`p-2 rounded-md ${
                                page === totalPages
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </nav>
                        </div>
                      )}
                    </>
                  )}

                  {/* Selected Item Details */}
                  {selectedItem && (
                    <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
                          <img
                            src={selectedItem.image || "/placeholder.svg?height=128&width=128"}
                            alt={selectedItem.name}
                            className="w-32 h-32 object-contain rounded-lg bg-white dark:bg-gray-700 p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=128&width=128"
                            }}
                          />
                        </div>
                        <div className="md:w-3/4 md:pl-6">
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                selectedItem.rarity === "Common"
                                  ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  : selectedItem.rarity === "Uncommon"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : selectedItem.rarity === "Rare"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                      : selectedItem.rarity === "Epic"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }`}
                            >
                              {selectedItem.rarity}
                            </span>
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                              {selectedItem.type}
                            </span>
                          </div>
                          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                            {selectedItem.description}
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Value
                              </p>
                              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                {selectedItem.value} gold
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                Quantity
                              </p>
                              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                {selectedItem.quantity}
                              </p>
                            </div>

                            {/* Additional stats if available */}
                            {selectedItem.stats &&
                              Object.entries(selectedItem.stats).map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 capitalize">
                                    {key}
                                  </p>
                                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                                    {value}
                                  </p>
                                </div>
                              ))}
                          </div>
                          <div className="mt-6 flex gap-2">
                            <button
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                              onClick={() => setActiveTab("sell")}
                            >
                              Sell
                            </button>
                            <button
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                              onClick={() => setActiveTab("trade")}
                            >
                              Trade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sell Tab */}
              {activeTab === "sell" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">
                    Sell Items
                  </h2>

                  {!selectedItem ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg transition-colors duration-200">
                      Please select an item from your inventory to sell.
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
                      <div className="p-6 flex items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <img
                          src={selectedItem.image || "/placeholder.svg?height=64&width=64"}
                          alt={selectedItem.name}
                          className="w-16 h-16 object-contain mr-4 rounded-md bg-white dark:bg-gray-700 p-1"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedItem.rarity === "Common"
                                ? "text-gray-400"
                                : selectedItem.rarity === "Uncommon"
                                  ? "text-green-500"
                                  : selectedItem.rarity === "Rare"
                                    ? "text-blue-500"
                                    : selectedItem.rarity === "Epic"
                                      ? "text-purple-500"
                                      : "text-yellow-500"
                            }`}
                          >
                            {selectedItem.rarity} {selectedItem.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                            Available: {selectedItem.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-white dark:bg-gray-800 transition-colors duration-200">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Quantity to Sell
                          </label>
                          <div className="flex items-center">
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                              onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={selectedItem.quantity}
                              value={sellQuantity}
                              onChange={(e) =>
                                setSellQuantity(
                                  Math.min(selectedItem.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)),
                                )
                              }
                              className="w-20 text-center py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
                            />
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                              onClick={() => setSellQuantity(Math.min(selectedItem.quantity, sellQuantity + 1))}
                            >
                              +
                            </button>
                            <button
                              className="ml-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              onClick={() => setSellQuantity(selectedItem.quantity)}
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                              Price per item:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                              {selectedItem.value} gold
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-800 dark:text-white transition-colors duration-200">Total:</span>
                            <span className="text-gray-900 dark:text-white transition-colors duration-200">
                              {selectedItem.value * sellQuantity} gold
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 mr-2"
                            onClick={() => setSelectedItem(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            onClick={handleSellItem}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <Loader className="animate-spin h-4 w-4 mr-2" />
                                Processing...
                              </div>
                            ) : (
                              `Sell for ${selectedItem.value * sellQuantity} gold`
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trade Tab */}
              {activeTab === "trade" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">
                    Trade with Other Players
                  </h2>

                  {!selectedItem ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg transition-colors duration-200">
                      Please select an item from your inventory to trade.
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
                      <div className="p-6 flex items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <img
                          src={selectedItem.image || "/placeholder.svg?height=64&width=64"}
                          alt={selectedItem.name}
                          className="w-16 h-16 object-contain mr-4 rounded-md bg-white dark:bg-gray-700 p-1"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedItem.rarity === "Common"
                                ? "text-gray-400"
                                : selectedItem.rarity === "Uncommon"
                                  ? "text-green-500"
                                  : selectedItem.rarity === "Rare"
                                    ? "text-blue-500"
                                    : selectedItem.rarity === "Epic"
                                      ? "text-purple-500"
                                      : "text-yellow-500"
                            }`}
                          >
                            {selectedItem.rarity} {selectedItem.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                            Available: {selectedItem.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-white dark:bg-gray-800 transition-colors duration-200">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Quantity to Trade
                          </label>
                          <div className="flex items-center">
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                              onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={selectedItem.quantity}
                              value={tradeQuantity}
                              onChange={(e) =>
                                setTradeQuantity(
                                  Math.min(selectedItem.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)),
                                )
                              }
                              className="w-20 text-center py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
                            />
                            <button
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                              onClick={() => setTradeQuantity(Math.min(selectedItem.quantity, tradeQuantity + 1))}
                            >
                              +
                            </button>
                            <button
                              className="ml-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              onClick={() => setTradeQuantity(selectedItem.quantity)}
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Select Trade Partner
                          </label>
                          <select
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            value={tradePartner ? tradePartner.id : ""}
                            onChange={(e) => {
                              const partnerId = Number.parseInt(e.target.value)
                              setTradePartner(partnerId ? otherPlayers.find((p) => p.id === partnerId) || null : null)
                            }}
                          >
                            <option value="">Select a player</option>
                            {otherPlayers.map((player) => (
                              <option key={player.id} value={player.id}>
                                {player.username}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            What would you like in return? (Optional)
                          </label>
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            rows={3}
                            placeholder="Describe what you want in return for this trade..."
                            value={tradeOffer}
                            onChange={(e) => setTradeOffer(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 mr-2"
                            onClick={() => setSelectedItem(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                            onClick={handleTradeItem}
                            disabled={!tradePartner || isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <Loader className="animate-spin h-4 w-4 mr-2" />
                                Processing...
                              </div>
                            ) : (
                              "Send Trade Offer"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Inventory

