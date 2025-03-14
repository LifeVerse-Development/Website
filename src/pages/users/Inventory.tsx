"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

// Define types for our data structures
interface InventoryItem {
  id: number
  name: string
  type: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  value: number
  quantity: number
  image: string
  description: string
}

interface User {
  id: number
  username: string
  gold: number
}

interface Player {
  id: number
  username: string
}

interface NotificationState {
  show: boolean
  message: string
  type: "success" | "error" | ""
}

// Mock inventory data
const initialInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Diamond Sword",
    type: "Weapon",
    rarity: "Epic",
    value: 5000,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
    description: "A powerful sword made of diamond that deals extra damage.",
  },
  {
    id: 2,
    name: "Health Potion",
    type: "Consumable",
    rarity: "Common",
    value: 50,
    quantity: 12,
    image: "/placeholder.svg?height=80&width=80",
    description: "Restores 100 health points when consumed.",
  },
  {
    id: 3,
    name: "Golden Armor",
    type: "Armor",
    rarity: "Rare",
    value: 2000,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
    description: "Provides excellent protection against physical attacks.",
  },
  {
    id: 4,
    name: "Magic Scroll",
    type: "Spell",
    rarity: "Uncommon",
    value: 750,
    quantity: 3,
    image: "/placeholder.svg?height=80&width=80",
    description: "Contains a powerful spell that can be learned or used once.",
  },
  {
    id: 5,
    name: "Ancient Coin",
    type: "Collectible",
    rarity: "Legendary",
    value: 10000,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
    description: "A rare coin from an ancient civilization. Highly valued by collectors.",
  },
  {
    id: 6,
    name: "Crafting Materials",
    type: "Resource",
    rarity: "Common",
    value: 25,
    quantity: 50,
    image: "/placeholder.svg?height=80&width=80",
    description: "Basic materials used for crafting various items.",
  },
]

// Mock user data
const mockUser: User = {
  id: 1,
  username: "Player1",
  gold: 15000,
}

// Mock other players for trading
const otherPlayers: Player[] = [
  { id: 2, username: "Player2" },
  { id: 3, username: "Player3" },
  { id: 4, username: "GuildMaster" },
  { id: 5, username: "Trader99" },
]

// Define rarity order as a Record type with specific keys
const rarityOrder: Record<"Common" | "Uncommon" | "Rare" | "Epic" | "Legendary", number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
}

export const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [sellQuantity, setSellQuantity] = useState<number>(1)
  const [tradeQuantity, setTradeQuantity] = useState<number>(1)
  const [tradePartner, setTradePartner] = useState<Player | null>(null)
  const [tradeOffer, setTradeOffer] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("inventory")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<string>("asc")
  const [filterType, setFilterType] = useState<string>("all")
  const [userGold, setUserGold] = useState<number>(mockUser.gold)
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: "", type: "" })

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rarity.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || item.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "value") {
        comparison = a.value - b.value
      } else if (sortBy === "rarity") {
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity]
      } else if (sortBy === "quantity") {
        comparison = a.quantity - b.quantity
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Handle item selection
  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setSellQuantity(1)
    setTradeQuantity(1)
  }

  // Handle selling items
  const handleSellItem = () => {
    if (!selectedItem) return

    const itemIndex = inventory.findIndex((item) => item.id === selectedItem.id)
    if (itemIndex === -1) return

    const item = inventory[itemIndex]
    if (sellQuantity > item.quantity) {
      showNotification("You don't have enough items to sell!", "error")
      return
    }

    const saleValue = item.value * sellQuantity

    // Update inventory
    const updatedInventory = [...inventory]
    if (sellQuantity === item.quantity) {
      updatedInventory.splice(itemIndex, 1)
    } else {
      updatedInventory[itemIndex] = {
        ...item,
        quantity: item.quantity - sellQuantity,
      }
    }

    setInventory(updatedInventory)
    setUserGold(userGold + saleValue)
    setSelectedItem(null)
    showNotification(`Successfully sold ${sellQuantity} ${item.name} for ${saleValue} gold!`, "success")
  }

  // Handle trading items
  const handleTradeItem = () => {
    if (!selectedItem || !tradePartner) return

    const itemIndex = inventory.findIndex((item) => item.id === selectedItem.id)
    if (itemIndex === -1) return

    const item = inventory[itemIndex]
    if (tradeQuantity > item.quantity) {
      showNotification("You don't have enough items to trade!", "error")
      return
    }

    // In a real app, this would initiate a trade request to the other player
    // For this mock-up, we'll just simulate a successful trade

    // Update inventory
    const updatedInventory = [...inventory]
    if (tradeQuantity === item.quantity) {
      updatedInventory.splice(itemIndex, 1)
    } else {
      updatedInventory[itemIndex] = {
        ...item,
        quantity: item.quantity - tradeQuantity,
      }
    }

    setInventory(updatedInventory)
    setSelectedItem(null)
    showNotification(`Trade offer sent to ${tradePartner.username}!`, "success")
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Get rarity color
  const getRarityColor = (rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary") => {
    switch (rarity) {
      case "Common":
        return "text-gray-400"
      case "Uncommon":
        return "text-green-500"
      case "Rare":
        return "text-blue-500"
      case "Epic":
        return "text-purple-500"
      case "Legendary":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16 transition-colors duration-200">

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                Inventory
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">
                Manage your items, sell them, or trade with other players.
              </p>
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
              {/* User Gold Display */}
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-4">
                  <span className="text-yellow-900 dark:text-yellow-100 font-bold">G</span>
                </div>
                <div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Your Gold</p>
                  <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{userGold.toLocaleString()}</p>
                </div>
              </div>

              {/* Inventory Tab */}
              {activeTab === "inventory" && (
                <div>
                  {/* Search and Filter */}
                  <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div>
                      <select
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Weapon">Weapons</option>
                        <option value="Armor">Armor</option>
                        <option value="Consumable">Consumables</option>
                        <option value="Spell">Spells</option>
                        <option value="Collectible">Collectibles</option>
                        <option value="Resource">Resources</option>
                      </select>
                    </div>

                    <div>
                      <select
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
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
                    </div>
                  </div>

                  {/* Inventory Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                            selectedItem && selectedItem.id === item.id
                              ? "border-blue-500 shadow-md transform scale-[1.02]"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                          } bg-white dark:bg-gray-800`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className="p-4 flex items-center">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-contain mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                                {item.name}
                              </h3>
                              <p className={`text-sm ${getRarityColor(item.rarity)}`}>{item.rarity}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                {item.type}
                              </p>
                              <div className="flex justify-between mt-1">
                                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                                  {item.value} gold
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        No items found matching your search criteria.
                      </div>
                    )}
                  </div>

                  {/* Selected Item Details */}
                  {selectedItem && (
                    <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
                          <img
                            src={selectedItem.image || "/placeholder.svg"}
                            alt={selectedItem.name}
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(selectedItem.rarity)} bg-opacity-10 dark:bg-opacity-20`}
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
                          src={selectedItem.image || "/placeholder.svg"}
                          alt={selectedItem.name}
                          className="w-16 h-16 object-contain mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h3>
                          <p className={`text-sm ${getRarityColor(selectedItem.rarity)}`}>
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
                          >
                            Sell for {selectedItem.value * sellQuantity} gold
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
                          src={selectedItem.image || "/placeholder.svg"}
                          alt={selectedItem.name}
                          className="w-16 h-16 object-contain mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {selectedItem.name}
                          </h3>
                          <p className={`text-sm ${getRarityColor(selectedItem.rarity)}`}>
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
                            disabled={!tradePartner}
                          >
                            Send Trade Offer
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

