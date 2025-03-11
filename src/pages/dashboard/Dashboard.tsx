"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import LazyLoading from "../../components/LazyLoading"
import {
  Users,
  Bell,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  HelpCircle,
  Settings,
  ChevronRight,
  Plus,
  Search,
  FileText,
  Award,
  Tag,
  Download,
  Star,
  Phone,
  Folder,
  ShoppingBag,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  Upload,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  List,
  Grid,
  ChevronLeft,
} from "lucide-react"

// Define types for content items
interface ContentItem {
  id: string
  title: string
  status: "published" | "draft" | "archived"
  createdAt: string
  updatedAt: string
  author?: string
  [key: string]: any
}

// Define types for content types
interface ContentType {
  id: string
  name: string
  slug: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  count: number
  description: string
  fields: {
    name: string
    type: "text" | "textarea" | "select" | "date" | "image" | "toggle" | "number" | "tags" | "rich-text" | "color"
    label: string
    required?: boolean
    options?: string[]
    placeholder?: string
  }[]
}

// Define types for dashboard metrics
interface MetricCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

// Define types for recent activity
interface RecentActivity {
  id: string
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

// Define types for notifications
interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeContentType, setActiveContentType] = useState<string | null>(null)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [contentItems, setContentItems] = useState<Record<string, ContentItem[]>>({})
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortField, setSortField] = useState("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Generate mock content types and data
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setLoading(false)
      return
    }

    // Simulate API call to fetch content types and data
    setTimeout(() => {
      // Mock content types
      const mockContentTypes: ContentType[] = [
        {
          id: "blogs",
          name: "Blogs",
          slug: "blogs",
          icon: <FileText size={20} />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          count: 24,
          description: "Manage your blog posts and articles",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "content", type: "rich-text", label: "Content", required: true },
            { name: "excerpt", type: "textarea", label: "Excerpt" },
            { name: "featuredImage", type: "image", label: "Featured Image" },
            { name: "categories", type: "tags", label: "Categories" },
            { name: "tags", type: "tags", label: "Tags" },
            { name: "publishDate", type: "date", label: "Publish Date" },
          ],
        },
        {
          id: "badges",
          name: "Badges",
          slug: "badges",
          icon: <Award size={20} />,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-600 dark:text-purple-400",
          count: 15,
          description: "Manage achievement badges and awards",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "description", type: "textarea", label: "Description" },
            { name: "image", type: "image", label: "Badge Image", required: true },
            { name: "criteria", type: "textarea", label: "Earning Criteria" },
            { name: "points", type: "number", label: "Points Value" },
            { name: "color", type: "color", label: "Badge Color" },
          ],
        },
        {
          id: "categories",
          name: "Categories",
          slug: "categories",
          icon: <Folder size={20} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
          count: 8,
          description: "Manage content categories and hierarchies",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "description", type: "textarea", label: "Description" },
            { name: "parent", type: "select", label: "Parent Category", options: ["None", "Category 1", "Category 2"] },
            { name: "slug", type: "text", label: "Slug" },
            { name: "icon", type: "text", label: "Icon" },
          ],
        },
        {
          id: "contacts",
          name: "Contacts",
          slug: "contacts",
          icon: <Phone size={20} />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
          count: 156,
          description: "Manage contact information and inquiries",
          fields: [
            { name: "name", type: "text", label: "Name", required: true },
            { name: "email", type: "text", label: "Email", required: true },
            { name: "phone", type: "text", label: "Phone Number" },
            { name: "message", type: "textarea", label: "Message" },
            { name: "status", type: "select", label: "Status", options: ["New", "In Progress", "Resolved"] },
            { name: "assignedTo", type: "text", label: "Assigned To" },
          ],
        },
        {
          id: "downloads",
          name: "Downloads",
          slug: "downloads",
          icon: <Download size={20} />,
          iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
          iconColor: "text-indigo-600 dark:text-indigo-400",
          count: 42,
          description: "Manage downloadable files and resources",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "description", type: "textarea", label: "Description" },
            { name: "file", type: "text", label: "File URL", required: true },
            { name: "fileSize", type: "text", label: "File Size" },
            { name: "downloadCount", type: "number", label: "Download Count" },
            { name: "categories", type: "tags", label: "Categories" },
            { name: "requiresRegistration", type: "toggle", label: "Requires Registration" },
          ],
        },
        {
          id: "events",
          name: "Events",
          slug: "events",
          icon: <Calendar size={20} />,
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          count: 18,
          description: "Manage events and schedules",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "description", type: "rich-text", label: "Description" },
            { name: "startDate", type: "date", label: "Start Date", required: true },
            { name: "endDate", type: "date", label: "End Date" },
            { name: "location", type: "text", label: "Location" },
            { name: "image", type: "image", label: "Event Image" },
            { name: "capacity", type: "number", label: "Capacity" },
            { name: "registrationRequired", type: "toggle", label: "Registration Required" },
          ],
        },
        {
          id: "faqs",
          name: "FAQs",
          slug: "faqs",
          icon: <HelpCircle size={20} />,
          iconBg: "bg-teal-100 dark:bg-teal-900/30",
          iconColor: "text-teal-600 dark:text-teal-400",
          count: 32,
          description: "Manage frequently asked questions",
          fields: [
            { name: "question", type: "text", label: "Question", required: true },
            { name: "answer", type: "rich-text", label: "Answer", required: true },
            {
              name: "category",
              type: "select",
              label: "Category",
              options: ["General", "Account", "Billing", "Technical"],
            },
            { name: "order", type: "number", label: "Display Order" },
            { name: "featured", type: "toggle", label: "Featured" },
          ],
        },
        {
          id: "products",
          name: "Products",
          slug: "products",
          icon: <ShoppingBag size={20} />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          count: 87,
          description: "Manage products and inventory",
          fields: [
            { name: "title", type: "text", label: "Title", required: true },
            { name: "description", type: "rich-text", label: "Description" },
            { name: "price", type: "number", label: "Price", required: true },
            { name: "salePrice", type: "number", label: "Sale Price" },
            { name: "sku", type: "text", label: "SKU" },
            { name: "inventory", type: "number", label: "Inventory" },
            { name: "images", type: "image", label: "Product Images" },
            { name: "categories", type: "tags", label: "Categories" },
            { name: "featured", type: "toggle", label: "Featured" },
          ],
        },
        {
          id: "tags",
          name: "Tags",
          slug: "tags",
          icon: <Tag size={20} />,
          iconBg: "bg-gray-100 dark:bg-gray-700",
          iconColor: "text-gray-600 dark:text-gray-400",
          count: 64,
          description: "Manage content tags and labels",
          fields: [
            { name: "name", type: "text", label: "Name", required: true },
            { name: "slug", type: "text", label: "Slug" },
            { name: "description", type: "textarea", label: "Description" },
            { name: "color", type: "color", label: "Tag Color" },
          ],
        },
        {
          id: "testimonials",
          name: "Testimonials",
          slug: "testimonials",
          icon: <Star size={20} />,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          count: 28,
          description: "Manage customer testimonials and reviews",
          fields: [
            { name: "name", type: "text", label: "Name", required: true },
            { name: "position", type: "text", label: "Position/Company" },
            { name: "content", type: "textarea", label: "Testimonial", required: true },
            { name: "rating", type: "number", label: "Rating (1-5)" },
            { name: "avatar", type: "image", label: "Avatar" },
            { name: "featured", type: "toggle", label: "Featured" },
          ],
        },
        {
          id: "tickets",
          name: "Tickets",
          slug: "tickets",
          icon: <Ticket size={20} />,
          iconBg: "bg-pink-100 dark:bg-pink-900/30",
          iconColor: "text-pink-600 dark:text-pink-400",
          count: 53,
          description: "Manage support tickets and inquiries",
          fields: [
            { name: "subject", type: "text", label: "Subject", required: true },
            { name: "description", type: "textarea", label: "Description", required: true },
            { name: "status", type: "select", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] },
            { name: "priority", type: "select", label: "Priority", options: ["Low", "Medium", "High", "Urgent"] },
            { name: "assignedTo", type: "text", label: "Assigned To" },
            {
              name: "category",
              type: "select",
              label: "Category",
              options: ["Technical", "Billing", "Account", "Other"],
            },
            { name: "attachments", type: "text", label: "Attachments" },
          ],
        },
      ]

      // Generate mock content items for each type
      const mockContentItems: Record<string, ContentItem[]> = {}

      mockContentTypes.forEach((type) => {
        const items: ContentItem[] = []
        const count = type.count

        for (let i = 1; i <= count; i++) {
          const status = i % 5 === 0 ? "draft" : i % 7 === 0 ? "archived" : "published"
          const createdDate = new Date()
          createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60))

          const updatedDate = new Date(createdDate)
          updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30))

          const item: ContentItem = {
            id: `${type.id}-${i}`,
            title: `${type.name.slice(0, -1)} ${i}`,
            status,
            createdAt: createdDate.toISOString(),
            updatedAt: updatedDate.toISOString(),
            author: user?.username || "Admin",
          }

          // Add type-specific fields
          if (type.id === "blogs") {
            item.excerpt = `This is a short excerpt for blog post ${i}...`
            item.categories = ["News", "Updates"].slice(0, (i % 2) + 1)
            item.tags = ["Important", "Featured", "New"].slice(0, (i % 3) + 1)
          } else if (type.id === "products") {
            item.price = 19.99 + i * 5
            item.inventory = Math.floor(Math.random() * 100)
            item.sku = `PROD-${1000 + i}`
          } else if (type.id === "tickets") {
            // Store the ticket status in a separate property
            item.ticketStatus = ["Open", "In Progress", "Resolved", "Closed"][i % 4]
          } else if (type.id === "testimonials") {
            item.rating = Math.floor(Math.random() * 3) + 3 // 3-5 stars
            item.name = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"][i % 4]
            item.position = ["CEO at Company", "Customer", "Developer", "Marketing Director"][i % 4]
          }

          items.push(item)
        }

        mockContentItems[type.id] = items
      })

      // Mock metrics data
      const mockMetrics: MetricCard[] = [
        {
          title: "Total Content",
          value: Object.values(mockContentItems).flat().length,
          change: 8.5,
          icon: <FileText size={20} />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
          title: "Published",
          value: Object.values(mockContentItems)
            .flat()
            .filter((item) => item.status === "published").length,
          change: 12.2,
          icon: <Check size={20} />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
        },
        {
          title: "Drafts",
          value: Object.values(mockContentItems)
            .flat()
            .filter((item) => item.status === "draft").length,
          change: -3.7,
          icon: <Edit size={20} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
        },
        {
          title: "Recent Activity",
          value: "24 hours ago",
          change: 5.3,
          icon: <Clock size={20} />,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-600 dark:text-purple-400",
        },
      ]

      // Mock recent activities
      const mockActivities: RecentActivity[] = [
        {
          id: "act-1",
          title: "Blog post published",
          description: "Blog 12 was published by Admin",
          timestamp: new Date().toISOString(),
          icon: <FileText size={16} />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
          id: "act-2",
          title: "Product updated",
          description: "Product 5 inventory updated to 45",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          icon: <ShoppingBag size={16} />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
        },
        {
          id: "act-3",
          title: "Ticket resolved",
          description: "Ticket 8 was marked as resolved",
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          icon: <Ticket size={16} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
        },
        {
          id: "act-4",
          title: "New testimonial",
          description: "New testimonial added from Emily Davis",
          timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
          icon: <Star size={16} />,
          iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
          iconColor: "text-indigo-600 dark:text-indigo-400",
        },
        {
          id: "act-5",
          title: "Category created",
          description: "New category 'Tutorials' was created",
          timestamp: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
          icon: <Folder size={16} />,
          iconBg: "bg-gray-100 dark:bg-gray-700",
          iconColor: "text-gray-600 dark:text-gray-400",
        },
      ]

      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "notif-1",
          title: "Content update",
          message: "5 new content items were published today",
          timestamp: new Date().toISOString(),
          read: false,
          type: "info",
        },
        {
          id: "notif-2",
          title: "System update",
          message: "The CMS will be updated tonight at 2 AM. Expect 15 minutes of downtime.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          type: "warning",
        },
        {
          id: "notif-3",
          title: "Backup completed",
          message: "Daily backup completed successfully",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          type: "success",
        },
        {
          id: "notif-4",
          title: "Storage warning",
          message: "You're using 85% of your storage quota. Consider upgrading your plan.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          type: "error",
        },
      ]

      setContentTypes(mockContentTypes)
      setContentItems(mockContentItems)
      setMetrics(mockMetrics)
      setRecentActivities(mockActivities)
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1500)
  }, [isAuthenticated, user])

  // Handle content type selection
  const handleContentTypeSelect = (typeId: string) => {
    setActiveTab("content")
    setActiveContentType(typeId)
    setSelectedItems([])
    setCurrentItem(null)
    setIsEditing(false)
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Handle item selection
  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (!activeContentType) return

    const allItems = contentItems[activeContentType]
    if (selectedItems.length === allItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(allItems.map((item) => item.id))
    }
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!activeContentType || selectedItems.length === 0) return

    // Simulate API call
    const updatedItems = { ...contentItems }
    updatedItems[activeContentType] = contentItems[activeContentType].filter((item) => !selectedItems.includes(item.id))

    setContentItems(updatedItems)
    setSelectedItems([])
    setNotification({
      type: "success",
      message: `${selectedItems.length} items deleted successfully`,
    })

    // Update content type count
    setContentTypes(
      contentTypes.map((type) =>
        type.id === activeContentType ? { ...type, count: updatedItems[activeContentType].length } : type,
      ),
    )

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: null, message: "" })
    }, 5000)
  }

  // Handle item edit
  const handleEditItem = (item: ContentItem) => {
    setCurrentItem(item)
    setIsEditing(true)
  }

  // Handle item view
  const handleViewItem = (item: ContentItem) => {
    setCurrentItem(item)
    setIsEditing(false)
  }

  // Handle item delete
  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteConfirm(true)
  }

  // Confirm delete item
  const confirmDeleteItem = () => {
    if (!activeContentType || !itemToDelete) return

    // Simulate API call
    const updatedItems = { ...contentItems }
    updatedItems[activeContentType] = contentItems[activeContentType].filter((item) => item.id !== itemToDelete)

    setContentItems(updatedItems)
    setItemToDelete(null)
    setShowDeleteConfirm(false)
    setNotification({
      type: "success",
      message: "Item deleted successfully",
    })

    // Update content type count
    setContentTypes(
      contentTypes.map((type) =>
        type.id === activeContentType ? { ...type, count: updatedItems[activeContentType].length } : type,
      ),
    )

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: null, message: "" })
    }, 5000)
  }

  // Handle save item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeContentType || !currentItem) return

    // Simulate API call
    const updatedItems = { ...contentItems }

    if (currentItem.id.includes("new-")) {
      // Create new item
      const newId = `${activeContentType}-${Date.now()}`
      const newItem = {
        ...currentItem,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      updatedItems[activeContentType] = [newItem, ...contentItems[activeContentType]]

      // Update content type count
      setContentTypes(
        contentTypes.map((type) => (type.id === activeContentType ? { ...type, count: type.count + 1 } : type)),
      )

      setNotification({
        type: "success",
        message: "Item created successfully",
      })
    } else {
      // Update existing item
      updatedItems[activeContentType] = contentItems[activeContentType].map((item) =>
        item.id === currentItem.id ? { ...currentItem, updatedAt: new Date().toISOString() } : item,
      )

      setNotification({
        type: "success",
        message: "Item updated successfully",
      })
    }

    setContentItems(updatedItems)
    setCurrentItem(null)
    setIsEditing(false)

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ type: null, message: "" })
    }, 5000)
  }

  // Handle create new item
  const handleCreateNew = () => {
    if (!activeContentType) return

    const contentType = contentTypes.find((type) => type.id === activeContentType)
    if (!contentType) return

    // Create a new item with default values
    const newItem: ContentItem = {
      id: `new-${Date.now()}`,
      title: "",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: user?.username || "Admin",
    }

    // Add default values for required fields
    contentType.fields.forEach((field) => {
      if (field.required && !newItem[field.name]) {
        if (field.type === "text" || field.type === "textarea" || field.type === "rich-text") {
          newItem[field.name] = ""
        } else if (field.type === "number") {
          newItem[field.name] = 0
        } else if (field.type === "select" && field.options && field.options.length > 0) {
          newItem[field.name] = field.options[0]
        } else if (field.type === "tags") {
          newItem[field.name] = []
        } else if (field.type === "toggle") {
          newItem[field.name] = false
        }
      }
    })

    setCurrentItem(newItem)
    setIsEditing(true)
  }

  // Handle input change in edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentItem) return

    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setCurrentItem({
        ...currentItem,
        [name]: checked,
      })
    } else if (type === "number") {
      setCurrentItem({
        ...currentItem,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setCurrentItem({
        ...currentItem,
        [name]: value,
      })
    }
  }

  // Handle tag input
  const handleTagInput = (name: string, value: string) => {
    if (!currentItem) return

    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    setCurrentItem({
      ...currentItem,
      [name]: tags,
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Get notification background
  const getNotificationBg = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20"
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20"
      case "success":
        return "bg-green-50 dark:bg-green-900/20"
      case "error":
        return "bg-red-50 dark:bg-red-900/20"
      default:
        return "bg-gray-50 dark:bg-gray-800"
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "draft":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  // Filter and sort content items
  const getFilteredAndSortedItems = () => {
    if (!activeContentType) return []

    let items = [...contentItems[activeContentType]]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)),
      )
    }

    // Sort items
    items.sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      // Handle date fields
      if (sortField === "createdAt" || sortField === "updatedAt") {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }

      // Handle string fields
      if (typeof valueA === "string" && typeof valueB === "string") {
        if (sortDirection === "asc") {
          return valueA.localeCompare(valueB)
        } else {
          return valueB.localeCompare(valueA)
        }
      }

      // Handle number fields
      if (sortDirection === "asc") {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    })

    return items
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
        <Navbar />
        <div className="relative overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>
          <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 text-center">
              Authentication Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
              Please log in to access the admin dashboard.
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

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Admin Dashboard Header */}
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your content and website resources</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 ${notification.read ? "" : "bg-blue-50 dark:bg-blue-900/10"}`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex-shrink-0 p-1.5 rounded-full ${getNotificationBg(notification.type)}`}
                                >
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {formatDate(notification.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications to display
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href="/notifications"
                        className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab("overview")
                  setActiveContentType(null)
                }}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === "content"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === "media"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-xl ${metric.iconBg} ${metric.iconColor} flex items-center justify-center`}
                      >
                        {metric.icon}
                      </div>
                      <div
                        className={`flex items-center ${
                          metric.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {metric.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Types Grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleContentTypeSelect(type.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:translate-y-[-2px] text-left"
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${type.iconBg} ${type.iconColor} flex items-center justify-center`}
                        >
                          {type.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{type.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{type.count} items</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <a
                    href="/activity"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>

                <div className="space-y-5">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}
                      >
                        <span className={activity.iconColor}>{activity.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {!activeContentType ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleContentTypeSelect(type.id)}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:translate-y-[-2px] text-left"
                    >
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <div className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${type.iconBg} ${type.iconColor} flex items-center justify-center`}
                          >
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{type.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{type.count} items</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Content Type Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveContentType(null)}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {contentTypes.find((type) => type.id === activeContentType)?.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contentItems[activeContentType]?.length || 0} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg ${
                          viewMode === "list"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg ${
                          viewMode === "grid"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                    </div>

                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete ({selectedItems.length})
                      </button>
                    )}

                    <button
                      onClick={handleCreateNew}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </button>
                  </div>
                </div>

                {/* Content Items */}
                {currentItem ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {isEditing ? (currentItem.id.includes("new-") ? "Create New" : "Edit") : "View"}{" "}
                          {contentTypes.find((type) => type.id === activeContentType)?.name.slice(0, -1)}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!isEditing ? (
                            <>
                              <button
                                onClick={() => handleEditItem(currentItem)}
                                className="p-2 rounded-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setCurrentItem(null)}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setCurrentItem(null)}
                              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <form onSubmit={handleSaveItem} className="space-y-6">
                          {contentTypes
                            .find((type) => type.id === activeContentType)
                            ?.fields.map((field) => (
                              <div key={field.name}>
                                <label
                                  htmlFor={field.name}
                                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === "text" && (
                                  <input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "textarea" && (
                                  <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    rows={4}
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "rich-text" && (
                                  <textarea
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    rows={8}
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "select" && (
                                  <select
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select {field.label}</option>
                                    {field.options?.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                )}

                                {field.type === "number" && (
                                  <input
                                    type="number"
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "date" && (
                                  <input
                                    type="date"
                                    id={field.name}
                                    name={field.name}
                                    value={currentItem[field.name]?.split("T")[0] || ""}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "toggle" && (
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={field.name}
                                      name={field.name}
                                      checked={currentItem[field.name] || false}
                                      onChange={handleInputChange}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor={field.name}
                                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                    >
                                      {field.label}
                                    </label>
                                  </div>
                                )}

                                {field.type === "tags" && (
                                  <input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={(currentItem[field.name] || []).join(", ")}
                                    onChange={(e) => handleTagInput(field.name, e.target.value)}
                                    required={field.required}
                                    placeholder="Enter tags separated by commas"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}

                                {field.type === "image" && (
                                  <div>
                                    <input
                                      type="text"
                                      id={field.name}
                                      name={field.name}
                                      value={currentItem[field.name] || ""}
                                      onChange={handleInputChange}
                                      required={field.required}
                                      placeholder="Enter image URL"
                                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="mt-2 flex items-center">
                                      <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {field.type === "color" && (
                                  <div className="flex">
                                    <input
                                      type="color"
                                      id={field.name}
                                      name={field.name}
                                      value={currentItem[field.name] || "#000000"}
                                      onChange={handleInputChange}
                                      className="h-10 w-10 rounded-l-lg border border-gray-300 dark:border-gray-600"
                                    />
                                    <input
                                      type="text"
                                      value={currentItem[field.name] || "#000000"}
                                      onChange={handleInputChange}
                                      name={field.name}
                                      className="flex-grow px-4 py-2 rounded-r-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                              type="button"
                              onClick={() => setCurrentItem(null)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                              {currentItem.id.includes("new-") ? "Create" : "Save Changes"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contentTypes
                              .find((type) => type.id === activeContentType)
                              ?.fields.map((field) => (
                                <div key={field.name} className="space-y-1">
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {field.label}
                                  </h4>
                                  {field.type === "tags" ? (
                                    <div className="flex flex-wrap gap-2">
                                      {(currentItem[field.name] || []).map((tag: string, index: number) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {(currentItem[field.name] || []).length === 0 && (
                                        <span className="text-gray-500 dark:text-gray-400">None</span>
                                      )}
                                    </div>
                                  ) : field.type === "toggle" ? (
                                    <span
                                      className={
                                        currentItem[field.name]
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }
                                    >
                                      {currentItem[field.name] ? "Yes" : "No"}
                                    </span>
                                  ) : field.type === "image" ? (
                                    currentItem[field.name] ? (
                                      <div className="mt-2">
                                        <img
                                          src={currentItem[field.name] || "/placeholder.svg"}
                                          alt={currentItem.title || "Image"}
                                          className="h-24 w-auto object-cover rounded-lg"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = "/placeholder.svg?height=96&width=96"
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 dark:text-gray-400">No image</span>
                                    )
                                  ) : field.type === "color" ? (
                                    <div className="flex items-center">
                                      <div
                                        className="h-5 w-5 rounded-full mr-2"
                                        style={{ backgroundColor: currentItem[field.name] || "#000000" }}
                                      ></div>
                                      <span>{currentItem[field.name] || "#000000"}</span>
                                    </div>
                                  ) : field.type === "rich-text" || field.type === "textarea" ? (
                                    <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                      {currentItem[field.name] || (
                                        <span className="text-gray-500 dark:text-gray-400">None</span>
                                      )}
                                    </p>
                                  ) : (
                                    <p className="text-gray-900 dark:text-white">
                                      {currentItem[field.name] || (
                                        <span className="text-gray-500 dark:text-gray-400">None</span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(currentItem.createdAt)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Updated</span>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(currentItem.updatedAt)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                                  <p className="text-sm">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(currentItem.status)}`}
                                    >
                                      {currentItem.status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={() => handleDeleteItem(currentItem.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedItems.length > 0 &&
                                    selectedItems.length === contentItems[activeContentType].length
                                  }
                                  onChange={handleSelectAll}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange("title")}
                            >
                              <div className="flex items-center">
                                <span>Title</span>
                                {sortField === "title" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange("status")}
                            >
                              <div className="flex items-center">
                                <span>Status</span>
                                {sortField === "status" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange("updatedAt")}
                            >
                              <div className="flex items-center">
                                <span>Updated</span>
                                {sortField === "updatedAt" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {getFilteredAndSortedItems().map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleItemSelect(item.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(item.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleViewItem(item)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredAndSortedItems().map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleItemSelect(item.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                              />
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewItem(item)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
                          {item.excerpt && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{item.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Updated {formatDate(item.updatedAt)}</span>
                            {item.author && <span>By {item.author}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="py-8 text-center">
            <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Media Library</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Upload and manage your media files. This feature will be available soon.
            </p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="py-8 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Management</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Manage users, roles, and permissions. This feature will be available soon.
            </p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="py-8 text-center">
            <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">System Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Configure system preferences and settings. This feature will be available soon.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="h-1 bg-red-500"></div>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Item</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this item? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteItem}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete(null)
                    setShowDeleteConfirm(false)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.type && (
        <div className="fixed bottom-4 right-4 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className={`h-1 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
          <div className="p-4 flex items-start">
            {notification.type === "success" ? (
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            )}
            <div className="flex-grow">
              <h3
                className={`text-sm font-medium ${notification.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}
              >
                {notification.type === "success" ? "Success" : "Error"}
              </h3>
              <p
                className={`mt-1 text-sm ${notification.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
              >
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification({ type: null, message: "" })}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AdminDashboard

