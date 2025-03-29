"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearCart } from "../stores/cartSlice"
import type { RootState } from "../stores/store"
import {
  CreditCard,
  ShoppingBag,
  Truck,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Shield,
  AlertCircle,
  Loader2,
  Check,
  X,
} from "lucide-react"
import axios from "axios"
import { config } from "../assets/config"

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  saveInfo: boolean
  shippingMethod: "standard" | "express" | "overnight"
  billingAddressSame: boolean
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    apartment?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  notes?: string
}

type CheckoutStep = "cart" | "shipping" | "payment" | "review" | "confirmation"

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address?.street || "",
    apartment: user?.address?.apartment || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "Germany",
    phone: user?.phoneNumber || "",
    saveInfo: true,
    shippingMethod: "standard",
    billingAddressSame: true,
    notes: "",
  })

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Currency and country code state
  const [userCurrency, setUserCurrency] = useState<string>("EUR")
  const [userCountryCode, setUserCountryCode] = useState<string>("DE")

  // Shipping rates with default values
  const [shippingRates, setShippingRates] = useState<{
    [country: string]: {
      standard: number
      express: number
      overnight: number
    }
  }>({
    Germany: { standard: 5.99, express: 12.99, overnight: 19.99 },
    Austria: { standard: 7.99, express: 14.99, overnight: 24.99 },
    Switzerland: { standard: 9.99, express: 16.99, overnight: 29.99 },
    France: { standard: 8.99, express: 15.99, overnight: 27.99 },
    Netherlands: { standard: 7.99, express: 14.99, overnight: 24.99 },
    Belgium: { standard: 7.99, express: 14.99, overnight: 24.99 },
    default: { standard: 12.99, express: 24.99, overnight: 39.99 },
  })

  const shippingCost = (shippingRates[formData.country] || shippingRates.default)[formData.shippingMethod]

  const taxRate = 0.19
  const tax = subtotal * taxRate
  const total = subtotal + shippingCost + tax

  // Detect user's location and set currency
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        if (data.country_code && data.currency) {
          setUserCountryCode(data.country_code)
          setUserCurrency(data.currency)

          // Update shipping rates based on detected country
          if (data.country_name && !shippingRates[data.country_name]) {
            setShippingRates((prevRates) => ({
              ...prevRates,
              [data.country_name]: {
                standard: 9.99,
                express: 19.99,
                overnight: 34.99,
              },
            }))
          }
        }
      } catch (error) {
        console.error("Error detecting user location:", error)
        setUserCountryCode("DE")
        setUserCurrency("EUR")
      }
    }

    detectUserLocation()
  }, [shippingRates])

  // Format price based on user's currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      userCountryCode === "DE" ? "de-DE" : `${userCountryCode.toLowerCase()}-${userCountryCode}`,
      {
        style: "currency",
        currency: userCurrency,
      },
    ).format(price)
  }

  // Handle input changes for all form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".") as [keyof CheckoutFormData, string]
        const parentData =
          prevData[parent] && typeof prevData[parent] === "object" ? (prevData[parent] as Record<string, any>) : {}

        return {
          ...prevData,
          [parent]: {
            ...parentData,
            [child]: value,
          },
        }
      } else {
        return {
          ...prevData,
          [name]: value,
        }
      }
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === "billingAddressSame" && !checked) {
      setFormData((prevData) => ({
        ...prevData,
        billingAddressSame: false,
        billingAddress: {
          firstName: prevData.firstName,
          lastName: prevData.lastName,
          address: prevData.address,
          apartment: prevData.apartment,
          city: prevData.city,
          state: prevData.state,
          postalCode: prevData.postalCode,
          country: prevData.country,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    if (name === "country") {
      console.log(`Country changed to ${value}, updating shipping rates`)
    }
  }

  // Validate current step
  const validateStep = (): boolean => {
    setError(null)

    if (currentStep === "cart" && items.length === 0) {
      setError("Your cart is empty. Add items before proceeding.")
      return false
    }

    if (currentStep === "shipping") {
      const requiredFields = [
        "email",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "postalCode",
        "country",
        "phone",
      ]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof CheckoutFormData])

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(", ")}`)
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return false
      }

      const postalCodeRegex = /^\d{5}$/
      if (!postalCodeRegex.test(formData.postalCode)) {
        setError("Please enter a valid postal code (5 digits)")
        return false
      }

      const phoneRegex = /^\+?[0-9\s]{10,15}$/
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        setError("Please enter a valid phone number")
        return false
      }
    }

    return true
  }

  // Navigation between steps
  const nextStep = () => {
    if (!validateStep()) return

    if (currentStep === "cart") setCurrentStep("shipping")
    else if (currentStep === "shipping") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("review")
    else if (currentStep === "review") processPayment()
  }

  const prevStep = () => {
    if (currentStep === "shipping") setCurrentStep("cart")
    else if (currentStep === "payment") setCurrentStep("shipping")
    else if (currentStep === "review") setCurrentStep("payment")
  }

  // Process payment
  const processPayment = useCallback(async () => {
    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const paymentData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customer: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        },
        shipping: {
          address: {
            line1: formData.address,
            line2: formData.apartment || "",
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
          },
          method: formData.shippingMethod,
        },
        billing: formData.billingAddressSame
          ? null
          : {
              address: {
                line1: formData.billingAddress?.address || "",
                line2: formData.billingAddress?.apartment || "",
                city: formData.billingAddress?.city || "",
                state: formData.billingAddress?.state || "",
                postal_code: formData.billingAddress?.postalCode || "",
                country: formData.billingAddress?.country || "",
              },
              name: `${formData.billingAddress?.firstName || ""} ${formData.billingAddress?.lastName || ""}`,
            },
        amount: {
          subtotal,
          shipping: shippingCost,
          tax,
          total,
        },
        notes: formData.notes || "",
      }

      console.log("Sending payment data:", paymentData)

      const response = await axios.post(`${config.apiUrl}/api/payments`, paymentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken || ""}`,
        },
      })

      const data = response.data

      if (data.redirectUrl) {
        console.log("Redirecting to Stripe:", data.redirectUrl)
        window.location.href = data.redirectUrl
        return
      }

      dispatch(clearCart())
      setCurrentStep("confirmation")
      showToast("Payment Successful", "Your order has been placed successfully!", "success")
    } catch (err) {
      console.error("Payment error:", err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unknown error occurred"
      setError(errorMessage)
      showToast("Payment Failed", errorMessage, "error")
    } finally {
      setIsProcessing(false)
    }
  }, [items, formData, dispatch, user?.accessToken, subtotal, shippingCost, tax, total])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && currentStep !== "cart") {
      navigate("/login?redirect=checkout")
    }
  }, [isAuthenticated, currentStep, navigate])

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        address: user.address?.street || prev.address,
        apartment: user.address?.apartment || prev.apartment,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        postalCode: user.address?.postalCode || prev.postalCode,
        country: user.address?.country || prev.country,
        phone: user.phoneNumber || prev.phone,
      }))
    }
  }, [user])

  // Update shipping costs when country changes
  useEffect(() => {
    if (!shippingRates[formData.country]) {
      console.log(`No specific shipping rates for ${formData.country}, using default rates`)
    }
  }, [formData.country, shippingRates])

  // Toast notification system
  const [toast, setToast] = useState<{
    visible: boolean
    title: string
    message: string
    type: "success" | "error" | "info"
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  })

  const showToast = (title: string, message: string, type: "success" | "error" | "info") => {
    setToast({ visible: true, title, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 5000)
  }

  // Render cart summary
  const renderCartSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h3>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            <button
              className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
              onClick={() => navigate("/store")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4">
                      <img
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                <p className="text-gray-900 dark:text-white">{formatPrice(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Shipping</p>
                <p className="text-gray-900 dark:text-white">{formatPrice(shippingCost)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Tax (19% VAT)</p>
                <p className="text-gray-900 dark:text-white">{formatPrice(tax)}</p>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-4" />

            <div className="flex justify-between font-medium text-lg">
              <p className="text-gray-900 dark:text-white">Total</p>
              <p className="text-gray-900 dark:text-white">{formatPrice(total)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )

  // Render different steps based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "cart":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
                      <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Cart</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Review your items before checkout</p>
                </div>
                <div className="p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                      <button
                        className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        onClick={() => navigate("/store")}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                        >
                          <div className="flex items-center">
                            <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4">
                              <img
                                src={item.image || "/placeholder.svg?height=80&width=80"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=80&width=80"
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium mt-1 text-gray-900 dark:text-white">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    onClick={() => navigate("/store")}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center"
                    onClick={nextStep}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>{renderCartSummary()}</div>
          </div>
        )

      case "shipping":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl mr-3">
                      <Truck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enter your shipping details</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact Information</h3>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email Address
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              required
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Phone Number
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+49 123 456 7890"
                              required
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Address</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            First Name
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John"
                              required
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Last Name
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              placeholder="Doe"
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Street Address & House Number
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          </div>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Winkelweg 4"
                            required
                            className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                            style={{ borderStyle: "solid", borderWidth: "1px" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="apartment"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Apartment, Suite, etc. (optional)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <input
                            id="apartment"
                            name="apartment"
                            type="text"
                            value={formData.apartment || ""}
                            onChange={handleInputChange}
                            placeholder="Apt 123, Suite 456"
                            className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                            style={{ borderStyle: "solid", borderWidth: "1px" }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            City
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <input
                              id="city"
                              name="city"
                              type="text"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              placeholder="Berlin"
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            State/Province
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                              </svg>
                            </div>
                            <input
                              id="state"
                              name="state"
                              type="text"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              placeholder="Bavaria"
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Postal Code
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <input
                              id="postalCode"
                              name="postalCode"
                              type="text"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                              placeholder="12345"
                              className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Country
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={(e) => handleSelectChange("country", e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          >
                            <option value="Germany">Germany</option>
                            <option value="Austria">Austria</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="France">France</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Belgium">Belgium</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Method</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center">
                            <div className="relative flex items-center">
                              <input
                                id="standard"
                                type="radio"
                                name="shippingMethod"
                                value="standard"
                                checked={formData.shippingMethod === "standard"}
                                onChange={() => handleSelectChange("shippingMethod", "standard")}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  formData.shippingMethod === "standard"
                                    ? "border-blue-600 dark:border-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {formData.shippingMethod === "standard" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                                )}
                              </div>
                              <label
                                htmlFor="standard"
                                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {`Standard Shipping (3-5 business days) - ${formData.country}`}
                              </label>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice((shippingRates[formData.country] || shippingRates.default).standard)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center">
                            <div className="relative flex items-center">
                              <input
                                id="express"
                                type="radio"
                                name="shippingMethod"
                                value="express"
                                checked={formData.shippingMethod === "express"}
                                onChange={() => handleSelectChange("shippingMethod", "express")}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  formData.shippingMethod === "express"
                                    ? "border-blue-600 dark:border-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {formData.shippingMethod === "express" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                                )}
                              </div>
                              <label
                                htmlFor="express"
                                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {`Express Shipping (2-3 business days) - ${formData.country}`}
                              </label>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice((shippingRates[formData.country] || shippingRates.default).express)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center">
                            <div className="relative flex items-center">
                              <input
                                id="overnight"
                                type="radio"
                                name="shippingMethod"
                                value="overnight"
                                checked={formData.shippingMethod === "overnight"}
                                onChange={() => handleSelectChange("shippingMethod", "overnight")}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  formData.shippingMethod === "overnight"
                                    ? "border-blue-600 dark:border-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {formData.shippingMethod === "overnight" && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                                )}
                              </div>
                              <label
                                htmlFor="overnight"
                                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {`Overnight Shipping (1 business day) - ${formData.country}`}
                              </label>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice((shippingRates[formData.country] || shippingRates.default).overnight)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          id="saveInfo"
                          type="checkbox"
                          checked={formData.saveInfo}
                          onChange={(e) => handleCheckboxChange("saveInfo", e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center ${
                            formData.saveInfo
                              ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                          }`}
                        >
                          {formData.saveInfo && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <label
                          htmlFor="saveInfo"
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          Save this information for next time
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Cart
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center"
                    onClick={nextStep}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>{renderCartSummary()}</div>
          </div>
        )

      case "payment":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Information</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review your billing details before proceeding to payment
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                      <div className="flex-shrink-0 mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Secure Payment with Stripe
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        After reviewing your order, you'll be redirected to Stripe's secure payment page where you can
                        choose your preferred payment method.
                      </p>
                      <div className="flex justify-center space-x-4 mb-4">
                        <img src="/placeholder.svg?height=30&width=50&text=Visa" alt="Visa" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=50&text=MC" alt="Mastercard" className="h-8" />
                        <img
                          src="/placeholder.svg?height=30&width=50&text=Amex"
                          alt="American Express"
                          className="h-8"
                        />
                        <img src="/placeholder.svg?height=30&width=50&text=PayPal" alt="PayPal" className="h-8" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your payment information is processed securely. We do not store credit card details.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="relative flex items-center">
                          <input
                            id="billingAddressSame"
                            type="checkbox"
                            checked={formData.billingAddressSame}
                            onChange={(e) => handleCheckboxChange("billingAddressSame", e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 border rounded flex items-center justify-center ${
                              formData.billingAddressSame
                                ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            }`}
                          >
                            {formData.billingAddressSame && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <label
                            htmlFor="billingAddressSame"
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            Billing address is the same as shipping address
                          </label>
                        </div>
                      </div>

                      {!formData.billingAddressSame && (
                        <div className="mt-4 space-y-4 border rounded-xl p-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing Address</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="billingFirstName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                First Name
                              </label>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                <input
                                  id="billingFirstName"
                                  name="billingAddress.firstName"
                                  type="text"
                                  value={formData.billingAddress?.firstName || ""}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="John"
                                  className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                                  style={{ borderStyle: "solid", borderWidth: "1px" }}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="billingLastName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Last Name
                              </label>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                <input
                                  id="billingLastName"
                                  name="billingAddress.lastName"
                                  type="text"
                                  value={formData.billingAddress?.lastName || ""}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="Doe"
                                  className="pl-10 block w-full rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3"
                                  style={{ borderStyle: "solid", borderWidth: "1px" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="billingAddress"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Street Address
                            </label>
                            <input
                              id="billingAddress"
                              name="billingAddress.address"
                              type="text"
                              value={formData.billingAddress?.address || ""}
                              onChange={handleInputChange}
                              required
                              className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="billingApartment"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Apartment, Suite, etc. (optional)
                            </label>
                            <input
                              id="billingApartment"
                              name="billingAddress.apartment"
                              type="text"
                              value={formData.billingAddress?.apartment || ""}
                              onChange={handleInputChange}
                              className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                              style={{ borderStyle: "solid", borderWidth: "1px" }}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label
                                htmlFor="billingCity"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                City
                              </label>
                              <input
                                id="billingCity"
                                name="billingAddress.city"
                                type="text"
                                value={formData.billingAddress?.city || ""}
                                onChange={handleInputChange}
                                required
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                style={{ borderStyle: "solid", borderWidth: "1px" }}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="billingState"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                State/Province
                              </label>
                              <input
                                id="billingState"
                                name="billingAddress.state"
                                type="text"
                                value={formData.billingAddress?.state || ""}
                                onChange={handleInputChange}
                                required
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                style={{ borderStyle: "solid", borderWidth: "1px" }}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="billingPostalCode"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                              >
                                Postal Code
                              </label>
                              <input
                                id="billingPostalCode"
                                name="billingAddress.postalCode"
                                type="text"
                                value={formData.billingAddress?.postalCode || ""}
                                onChange={handleInputChange}
                                required
                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                style={{ borderStyle: "solid", borderWidth: "1px" }}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="billingCountry"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Country
                            </label>
                            <select
                              id="billingCountry"
                              name="billingAddress.country"
                              value={formData.billingAddress?.country || "Germany"}
                              onChange={(e) => {
                                if (formData.billingAddress) {
                                  const updatedBillingAddress = {
                                    ...formData.billingAddress,
                                    country: e.target.value,
                                  }
                                  setFormData({
                                    ...formData,
                                    billingAddress: updatedBillingAddress,
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    billingAddress: {
                                      firstName: "",
                                      lastName: "",
                                      address: "",
                                      city: "",
                                      state: "",
                                      postalCode: "",
                                      country: e.target.value,
                                    },
                                  })
                                }
                              }}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            >
                              <option value="Germany">Germany</option>
                              <option value="Austria">Austria</option>
                              <option value="Switzerland">Switzerland</option>
                              <option value="France">France</option>
                              <option value="Netherlands">Netherlands</option>
                              <option value="Belgium">Belgium</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Order Notes (Optional)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes || ""}
                          onChange={handleInputChange}
                          placeholder="Special instructions for delivery or any other notes"
                          rows={4}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shipping
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center"
                    onClick={nextStep}
                  >
                    Review Order
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>{renderCartSummary()}</div>
          </div>
        )

      case "review":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl mr-3">
                      <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Your Order</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please review your order before proceeding to payment
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Items</h3>
                        <button
                          className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setCurrentStep("cart")}
                        >
                          Edit
                        </button>
                      </div>

                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4">
                                <img
                                  src={item.image || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=64&width=64"
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Information</h3>
                        <button
                          className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setCurrentStep("shipping")}
                        >
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact</h4>
                          <p className="text-gray-900 dark:text-white">{formData.email}</p>
                          <p className="text-gray-900 dark:text-white">{formData.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ship to</h4>
                          <p className="text-gray-900 dark:text-white">
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formData.address}
                            {formData.apartment ? `, ${formData.apartment}` : ""}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formData.city}, {formData.state} {formData.postalCode}
                          </p>
                          <p className="text-gray-900 dark:text-white">{formData.country}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Method</h4>
                        <p className="text-gray-900 dark:text-white">
                          {formData.shippingMethod === "standard" && "Standard Shipping (3-5 business days)"}
                          {formData.shippingMethod === "express" && "Express Shipping (2-3 business days)"}
                          {formData.shippingMethod === "overnight" && "Overnight Shipping (1 business day)"}
                          {" - "}
                          {formatPrice(shippingCost)}
                        </p>
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing Information</h3>
                        <button
                          className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setCurrentStep("payment")}
                        >
                          Edit
                        </button>
                      </div>

                      {formData.billingAddressSame ? (
                        <p className="text-gray-900 dark:text-white">Same as shipping address</p>
                      ) : (
                        <div>
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Billing Address</h4>
                          <p className="text-gray-900 dark:text-white">
                            {formData.billingAddress?.firstName} {formData.billingAddress?.lastName}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formData.billingAddress?.address}
                            {formData.billingAddress?.apartment ? `, ${formData.billingAddress.apartment}` : ""}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formData.billingAddress?.city}, {formData.billingAddress?.state}{" "}
                            {formData.billingAddress?.postalCode}
                          </p>
                          <p className="text-gray-900 dark:text-white">{formData.billingAddress?.country}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Payment via Stripe</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            You'll be redirected to Stripe's secure payment page to complete your purchase.
                          </p>
                        </div>
                      </div>
                    </div>

                    {formData.notes && (
                      <>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div>
                          <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Notes</h4>
                          <p className="text-gray-900 dark:text-white">{formData.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Payment
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center"
                    onClick={nextStep}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              {renderCartSummary()}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your payment information is processed securely by Stripe. We do not store credit card details nor have
                  access to your credit card information.
                </p>
              </div>
            </div>
          </div>
        )

      case "confirmation":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
                <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h2>
                <p className="text-gray-500 dark:text-gray-400">Thank you for your purchase</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    We've sent a confirmation email to <span className="font-medium">{formData.email}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Order number: <span className="font-medium">#{Math.floor(Math.random() * 10000000)}</span>
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Tax</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(tax)}</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.address}
                        {formData.apartment ? `, ${formData.apartment}` : ""}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.city}, {formData.state} {formData.postalCode}
                      </p>
                      <p className="text-gray-900 dark:text-white">{formData.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Shipping Method</p>
                      <p className="text-gray-900 dark:text-white">
                        {formData.shippingMethod === "standard" && "Standard Shipping (3-5 business days)"}
                        {formData.shippingMethod === "express" && "Express Shipping (2-3 business days)"}
                        {formData.shippingMethod === "overnight" && "Overnight Shipping (1 business day)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  onClick={() => navigate("/account/orders")}
                >
                  View Order Status
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
                  onClick={() => navigate("/store")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )
    }
  }

  // Show error message if there is one
  const renderError = () => {
    if (!error) return null

    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  // Toast notification
  const renderToast = () => {
    if (!toast.visible) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md">
        <div
          className={`rounded-lg shadow-lg p-4 flex items-start ${
            toast.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : toast.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          }`}
        >
          <div
            className={`flex-shrink-0 mr-3 ${
              toast.type === "success"
                ? "text-green-500 dark:text-green-400"
                : toast.type === "error"
                  ? "text-red-500 dark:text-red-400"
                  : "text-blue-500 dark:text-blue-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : toast.type === "error" ? (
              <X className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <h3
              className={`text-sm font-medium ${
                toast.type === "success"
                  ? "text-green-800 dark:text-green-300"
                  : toast.type === "error"
                    ? "text-red-800 dark:text-red-300"
                    : "text-blue-800 dark:text-blue-300"
              }`}
            >
              {toast.title}
            </h3>
            <p
              className={`mt-1 text-sm ${
                toast.type === "success"
                  ? "text-green-700 dark:text-green-400"
                  : toast.type === "error"
                    ? "text-red-700 dark:text-red-400"
                    : "text-blue-700 dark:text-blue-400"
              }`}
            >
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="ml-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pt-20 pb-16">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Checkout
              </h1>

              {/* Checkout Steps */}
              <div className="mt-6 mb-8">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex flex-col items-center ${currentStep === "cart" || currentStep === "confirmation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "cart" || currentStep === "confirmation" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-medium">Cart</span>
                  </div>

                  <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full bg-blue-500 transition-all ${currentStep === "cart" ? "w-0" : currentStep === "shipping" ? "w-1/3" : currentStep === "payment" ? "w-2/3" : "w-full"}`}
                    ></div>
                  </div>

                  <div
                    className={`flex flex-col items-center ${currentStep === "shipping" || currentStep === "confirmation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "shipping" || currentStep === "confirmation" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <Truck className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-medium">Shipping</span>
                  </div>

                  <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full bg-blue-500 transition-all ${currentStep === "cart" || currentStep === "shipping" ? "w-0" : currentStep === "payment" ? "w-1/2" : "w-full"}`}
                    ></div>
                  </div>

                  <div
                    className={`flex flex-col items-center ${currentStep === "payment" || currentStep === "confirmation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "payment" || currentStep === "confirmation" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-medium">Payment</span>
                  </div>

                  <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full bg-blue-500 transition-all ${currentStep === "cart" || currentStep === "shipping" || currentStep === "payment" ? "w-0" : currentStep === "review" ? "w-1/2" : "w-full"}`}
                    ></div>
                  </div>

                  <div
                    className={`flex flex-col items-center ${currentStep === "review" || currentStep === "confirmation" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "review" || currentStep === "confirmation" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-medium">Confirm</span>
                  </div>
                </div>
              </div>

              {renderError()}
            </div>

            {renderStepContent()}
          </div>
        </div>
        {renderToast()}
      </div>
    </div>
  )
}

export default Checkout

