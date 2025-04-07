"use client"

import { useState } from "react"
import {
  Shield,
  Sword,
  PillBottleIcon as Potion,
  Scroll,
  Gem,
  Package,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  ShoppingCart,
  Share2,
} from "lucide-react"

// Define types for our data structures
export interface IInventoryItem {
  id: number
  name: string
  type: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  value: number
  quantity: number
  image: string
  description: string
  stats?: {
    [key: string]: number | string
  }
  level?: number
  durability?: {
    current: number
    max: number
  }
  cooldown?: number
  weight?: number
  acquiredDate?: string
}

interface IInventoryItemProps {
  item: IInventoryItem
  isSelected: boolean
  onSelect: (item: IInventoryItem) => void
  onSell?: () => void
  onTrade?: () => void
}

export const InventoryItem = ({ item, isSelected, onSelect, onSell, onTrade }: IInventoryItemProps) => {
  const [showDetails, setShowDetails] = useState(false)

  // Get rarity color
  const getRarityColor = (rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary") => {
    switch (rarity) {
      case "Common":
        return "text-gray-400 border-gray-400 bg-gray-100 dark:bg-gray-800"
      case "Uncommon":
        return "text-green-500 border-green-500 bg-green-100 dark:bg-green-900/20"
      case "Rare":
        return "text-blue-500 border-blue-500 bg-blue-100 dark:bg-blue-900/20"
      case "Epic":
        return "text-purple-500 border-purple-500 bg-purple-100 dark:bg-purple-900/20"
      case "Legendary":
        return "text-yellow-500 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
      default:
        return "text-gray-400 border-gray-400 bg-gray-100 dark:bg-gray-800"
    }
  }

  // Get icon based on item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case "Weapon":
        return <Sword className="h-4 w-4" />
      case "Armor":
        return <Shield className="h-4 w-4" />
      case "Consumable":
        return <Potion className="h-4 w-4" />
      case "Spell":
        return <Scroll className="h-4 w-4" />
      case "Collectible":
        return <Gem className="h-4 w-4" />
      case "Resource":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? "border-blue-500 shadow-md transform scale-[1.02]"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
      } bg-white dark:bg-gray-800`}
    >
      {/* Item Header - Always visible */}
      <div className="p-4 flex items-center cursor-pointer" onClick={() => onSelect(item)}>
        <div className="relative">
          <img
            src={item.image || "/placeholder.svg?height=64&width=64"}
            alt={item.name}
            className="w-16 h-16 object-contain rounded-md bg-gray-50 dark:bg-gray-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=64&width=64"
            }}
          />
          {item.quantity > 1 && (
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {item.quantity}
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{item.name}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
              {getItemIcon(item.type)}
              <span className="ml-1">{item.type}</span>
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {item.value}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(!showDetails)
              }}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>{item.description}</p>
          </div>

          {/* Item Stats */}
          {item.stats && Object.keys(item.stats).length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">Stats</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}:</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {item.level !== undefined && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Level:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.level}</span>
              </div>
            )}
            {item.durability && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Durability:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {item.durability.current}/{item.durability.max}
                </span>
              </div>
            )}
            {item.weight !== undefined && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Weight:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.weight} kg</span>
              </div>
            )}
            {item.cooldown !== undefined && (
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Cooldown:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.cooldown}s</span>
              </div>
            )}
            {item.acquiredDate && (
              <div className="flex justify-between col-span-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Acquired:</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(item.acquiredDate)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-2">
            {onSell && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSell()
                }}
                className="flex-1 text-xs px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Sell
              </button>
            )}
            {onTrade && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTrade()
                }}
                className="flex-1 text-xs px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Trade
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryItem

