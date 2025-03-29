"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../stores/authSlice"
import { removeItem, updateQuantity, clearCart } from "../stores/cartSlice"
import type { RootState } from "../stores/store"
import ThemeToggle from "./ThemeToggle"
import { Menu, X, ChevronDown, Home, ShoppingBag, Newspaper, Mail, LogOut, Settings, User, History, TicketCheck, LayoutDashboard, ShoppingCart, Trash, Plus, Minus, Activity, TowerControl } from 'lucide-react'

const Navbar: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const { items: cartItems } = useSelector((state: RootState) => state.cart)
    const [hasTickets, setHasTickets] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const [isCartMenuOpen, setIsCartMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen)
    const toggleCartMenu = () => setIsCartMenuOpen(!isCartMenuOpen)

    const handleLogout = () => {
        dispatch(logout())
        navigate("/")
        setIsProfileMenuOpen(false)
    }

    useEffect(() => {
        if (user?.userId) {
            fetch(`http://localhost:3001/api/tickets?userId=${user.userId}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        setHasTickets(true)
                    }
                })
                .catch((error) => console.error("Error fetching tickets:", error))
        }
    }, [user])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (isProfileMenuOpen && !target.closest(".profile-menu-container")) {
                setIsProfileMenuOpen(false)
            }
            if (isCartMenuOpen && !target.closest(".cart-menu-container")) {
                setIsCartMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isProfileMenuOpen, isCartMenuOpen])

    const hasRole = user?.role || ""
    const hasTeamRole = ["Supporter", "Content", "Developer", "Moderator", "Admin"].includes(hasRole)

    const navItems = [
        { name: "Home", path: "/", icon: <Home size={18} /> },
        { name: "News", path: "/news", icon: <Newspaper size={18} /> },
        { name: "Store", path: "/store", icon: <ShoppingBag size={18} /> },
        { name: "Status", path: "/status", icon: <Activity size={18} /> },
        { name: "Contact", path: "/contact", icon: <Mail size={18} /> },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg" : "bg-white dark:bg-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Mobile Menu Button */}
                    <div className="flex items-center">
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        <Link to="/" className="flex items-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-full p-1">
                                    <img
                                        src="/logo.png"
                                        alt="LifeVerse Logo"
                                        className="h-8 w-8 rounded-full object-cover transition-transform duration-500 ease-out group-hover:rotate-180"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = "/placeholder.svg?height=32&width=32"
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="ml-3 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                LifeVerse
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-all duration-200 ${isActive(item.path)
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                                    }`}
                            >
                                <span className="opacity-75">{item.icon}</span>
                                <span>{item.name}</span>
                                {isActive(item.path) && (
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Auth & Theme */}
                    <div className="flex items-center space-x-2">
                        {isAuthenticated && (
                            <div className="relative cart-menu-container">
                                <button
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isCartMenuOpen ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                                    onClick={toggleCartMenu}
                                >
                                    <div className="relative">
                                        <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                                        {cartItems.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {isCartMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Shopping Cart ({cartItems.length})</p>
                                            {cartItems.length > 0 && (
                                                <button
                                                    onClick={() => dispatch(clearCart())}
                                                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                                                >
                                                    <Trash size={14} className="mr-1" />
                                                    Clear All
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {cartItems.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    Your cart is empty
                                                </div>
                                            ) : (
                                                <div className="py-2">
                                                    {cartItems.map((item) => (
                                                        <div key={item.id} className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                            <img
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement
                                                                    target.src = "/placeholder.svg?height=48&width=48"
                                                                }}
                                                            />
                                                            <div className="ml-3 flex-1">
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                                                                <div className="flex items-center mt-1">
                                                                    <button
                                                                        onClick={() => dispatch(updateQuantity({ id: item.id, amount: -1 }))}
                                                                        className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="mx-2 text-sm dark:text-white">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(updateQuantity({ id: item.id, amount: 1 }))}
                                                                        className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                                                <button
                                                                    onClick={() => dispatch(removeItem({ id: item.id }))}
                                                                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-1"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {cartItems.length > 0 && (
                                            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                                                    <span className="text-sm font-medium dark:text-white">
                                                        ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <Link
                                                    to="/checkout"
                                                    onClick={() => setIsCartMenuOpen(false)}
                                                    className="w-full block text-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                                >
                                                    Checkout
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="relative profile-menu-container">
                                <button
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isProfileMenuOpen ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={toggleProfileMenu}
                                >
                                    <div className="relative">
                                        <img
                                            src={user?.profilePicture || "https://placehold.co/600x400/png"}
                                            alt="Profile"
                                            className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-gray-800"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.src = "https://placehold.co/600x400/png"
                                            }}
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                    </div>
                                    <span className="max-w-[100px] truncate text-gray-700 dark:text-gray-300">{user?.username}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                                            <p className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">{user?.username}</p>
                                        </div>
                                        <div className="py-1">
                                            {hasTeamRole && (
                                                <MenuLink to="/control_panel" icon={<TowerControl size={16} />}>
                                                    Control Panel
                                                </MenuLink>
                                            )}
                                            {hasTeamRole && (
                                                <MenuLink to="/dashboard" icon={<LayoutDashboard size={16} />}>
                                                    Dashboard
                                                </MenuLink>
                                            )}
                                            {hasTickets && (
                                                <MenuLink to={`/support`} icon={<TicketCheck size={16} />}>
                                                    Tickets
                                                </MenuLink>
                                            )}
                                            <MenuLink to={`/profile/${user?.username}`} icon={<User size={16} />}>
                                                Profile
                                            </MenuLink>
                                            <MenuLink to={`/profile/${user?.username}/settings`} icon={<Settings size={16} />}>
                                                Settings
                                            </MenuLink>
                                            <MenuLink to={`/profile/${user?.username}/history`} icon={<History size={16} />}>
                                                History
                                            </MenuLink>
                                        </div>
                                        <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-1"></div>

                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-200 ${isActive(item.path)
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

// Helper component for menu links
interface MenuLinkProps {
    to: string
    icon: React.ReactNode
    children: React.ReactNode
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, icon, children }) => (
    <Link
        to={to}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
        <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
        {children}
    </Link>
)

export default Navbar
