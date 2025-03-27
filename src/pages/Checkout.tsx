"use client"

import type React from "react"
//import Cookies from 'js-cookie';
import { useState, useEffect, useCallback, useRef } from "react"
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
        phone: "",
        saveInfo: true,
        shippingMethod: "standard",
        billingAddressSame: true,
        notes: "",
    })

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const shippingCost =
        formData.shippingMethod === "standard" ? 5.99 : formData.shippingMethod === "express" ? 12.99 : 19.99
    const taxRate = 0.19
    const tax = subtotal * taxRate
    const total = subtotal + shippingCost + tax

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(price)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        setFormData((prevData) => {
            if (name.includes(".")) {
                const [parent, child] = name.split(".") as [keyof CheckoutFormData, string];
    
                const parentData = prevData[parent] && typeof prevData[parent] === "object"
                    ? prevData[parent] as Record<string, any>
                    : {}; // Fallback auf ein leeres Objekt
    
                return {
                    ...prevData,
                    [parent]: {
                        ...parentData,
                        [child]: value,
                    },
                };
            } else {
                return {
                    ...prevData,
                    [name]: value,
                };
            }
        });
    };            

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

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

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

    const processPayment = useCallback(async () => {
        if (items.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setIsProcessing(true);
        setError(null);

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
            };

            console.log("Sending payment data:", paymentData);

            //const csrfToken = Cookies.get('X-CSRF-TOKEN') || "";

            const response = await axios.post(
                "http://localhost:3001/api/payments",
                paymentData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.accessToken || ""}`,
                    },
                }
            );

            const data = response.data;

            if (data.redirectUrl) {
                console.log("Redirecting to Stripe:", data.redirectUrl);
                window.location.href = data.redirectUrl;
                return;
            }

            dispatch(clearCart());
            setCurrentStep("confirmation");
            showToast("Payment Successful", "Your order has been placed successfully!", "success");
        } catch (err) {
            console.error("Payment error:", err);
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : "An unknown error occurred";
            setError(errorMessage);
            showToast("Payment Failed", errorMessage, "error");
        } finally {
            setIsProcessing(false);
        }
    }, [items, formData, dispatch, user?.accessToken, subtotal, shippingCost, tax, total]);

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
                city: user.address?.city || prev.city,
                state: user.address?.state || prev.state,
                postalCode: user.address?.postalCode || prev.postalCode,
                country: user.address?.country || prev.country,
            }))
        }
    }, [user])

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

    // Custom UI Components
    const Button: React.FC<{
        children: React.ReactNode
        onClick?: () => void
        variant?: "primary" | "outline" | "ghost"
        size?: "sm" | "md" | "lg"
        disabled?: boolean
        className?: string
        type?: "button" | "submit" | "reset"
    }> = ({ children, onClick, variant = "primary", size = "md", disabled = false, className = "", type = "button" }) => {
        const baseClasses =
            "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"

        const variantClasses = {
            primary:
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
            outline:
                "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500",
            ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500",
        }

        const sizeClasses = {
            sm: "px-3 py-2 text-sm",
            md: "px-4 py-2.5",
            lg: "px-6 py-3 text-lg",
        }

        const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            >
                {children}
            </button>
        )
    }

    // Input component with ref to maintain focus
    const Input: React.FC<{
        id: string
        name: string
        type?: string
        value: string
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
        placeholder?: string
        required?: boolean
        className?: string
        disabled?: boolean
        icon?: React.ReactNode
    }> = ({
        id,
        name,
        type = "text",
        value,
        onChange,
        placeholder = "",
        required = false,
        className = "",
        disabled = false,
        icon,
    }) => {
            const inputRef = useRef<HTMLInputElement>(null)

            return (
                <div className="relative rounded-md shadow-sm">
                    {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
                    <input
                        ref={inputRef}
                        id={id}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        className={`${icon ? "pl-10" : "px-4"} block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white py-3 ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
                        style={{ borderStyle: "solid", borderWidth: "1px" }}
                    />
                </div>
            )
        }

    const Label: React.FC<{
        htmlFor: string
        children: React.ReactNode
        className?: string
    }> = ({ htmlFor, children, className = "" }) => {
        return (
            <label
                htmlFor={htmlFor}
                className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}
            >
                {children}
            </label>
        )
    }

    const Select: React.FC<{
        id: string
        name: string
        value: string
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
        children: React.ReactNode
        className?: string
        disabled?: boolean
    }> = ({ id, name, value, onChange, children, className = "", disabled = false }) => {
        return (
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
            >
                {children}
            </select>
        )
    }

    const Textarea: React.FC<{
        id: string
        name: string
        value: string
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
        placeholder?: string
        rows?: number
        className?: string
    }> = ({ id, name, value, onChange, placeholder = "", rows = 4, className = "" }) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null)

        return (
            <textarea
                ref={textareaRef}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-none ${className}`}
            />
        )
    }

    const Checkbox: React.FC<{
        id: string
        checked: boolean
        onChange: (checked: boolean) => void
        label: string
        className?: string
    }> = ({ id, checked, onChange, label, className = "" }) => {
        return (
            <div className={`flex items-center ${className}`}>
                <div className="relative flex items-center">
                    <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only"
                    />
                    <div
                        className={`w-5 h-5 border rounded flex items-center justify-center ${checked
                            ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            }`}
                    >
                        {checked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <label htmlFor={id} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {label}
                    </label>
                </div>
            </div>
        )
    }

    const RadioGroup: React.FC<{
        children: React.ReactNode
        className?: string
    }> = ({ children, className = "" }) => {
        return <div className={`space-y-2 ${className}`}>{children}</div>
    }

    const RadioItem: React.FC<{
        id: string
        name: string
        value: string
        checked: boolean
        onChange: (value: string) => void
        label: React.ReactNode
        className?: string
    }> = ({ id, name, value, checked, onChange, label, className = "" }) => {
        return (
            <div className={`flex items-center ${className}`}>
                <div className="relative flex items-center">
                    <input
                        id={id}
                        type="radio"
                        name={name}
                        value={value}
                        checked={checked}
                        onChange={() => onChange(value)}
                        className="sr-only"
                    />
                    <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${checked ? "border-blue-600 dark:border-blue-500" : "border-gray-300 dark:border-gray-600"
                            }`}
                    >
                        {checked && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500"></div>}
                    </div>
                    <label htmlFor={id} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        {label}
                    </label>
                </div>
            </div>
        )
    }

    const Card: React.FC<{
        children: React.ReactNode
        className?: string
        gradient?: string
    }> = ({ children, className = "", gradient = "from-blue-500 to-purple-500" }) => {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${className}`}>
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                {children}
            </div>
        )
    }

    const CardHeader: React.FC<{
        children: React.ReactNode
        className?: string
    }> = ({ children, className = "" }) => {
        return <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
    }

    const CardContent: React.FC<{
        children: React.ReactNode
        className?: string
    }> = ({ children, className = "" }) => {
        return <div className={`p-6 ${className}`}>{children}</div>
    }

    const CardFooter: React.FC<{
        children: React.ReactNode
        className?: string
    }> = ({ children, className = "" }) => {
        return <div className={`p-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
    }

    const Separator: React.FC<{
        className?: string
    }> = ({ className = "" }) => {
        return <hr className={`border-gray-200 dark:border-gray-700 ${className}`} />
    }

    // Render cart summary
    const renderCartSummary = () => (
        <Card gradient="from-purple-500 to-pink-500">
            <CardContent>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h3>

                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate("/store")}>
                            Continue Shopping
                        </Button>
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

                        <Separator className="my-4" />

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

                        <Separator className="my-4" />

                        <div className="flex justify-between font-medium text-lg">
                            <p className="text-gray-900 dark:text-white">Total</p>
                            <p className="text-gray-900 dark:text-white">{formatPrice(total)}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )

    // Render different steps based on current step
    const renderStepContent = () => {
        switch (currentStep) {
            case "cart":
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
                                            <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Cart</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Review your items before checkout</p>
                                </CardHeader>
                                <CardContent>
                                    {items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                                            <Button variant="outline" className="mt-4" onClick={() => navigate("/store")}>
                                                Continue Shopping
                                            </Button>
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
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => navigate("/store")}>
                                        Continue Shopping
                                    </Button>
                                    <Button onClick={nextStep} disabled={items.length === 0}>
                                        Proceed to Checkout
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                        <div>{renderCartSummary()}</div>
                    </div>
                )

            case "shipping":
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card gradient="from-teal-500 to-emerald-500">
                                <CardHeader>
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl mr-3">
                                            <Truck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter your shipping details</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact Information</h3>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="your@email.com"
                                                        required
                                                        icon={
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
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+49 123 456 7890"
                                                        required
                                                        icon={
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
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Address</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                        icon={
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
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="address">Street Address</Label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    icon={
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
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="apartment">Apartment, Suite, etc. (optional)</Label>
                                                <Input
                                                    id="apartment"
                                                    name="apartment"
                                                    value={formData.apartment || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="state">State/Province</Label>
                                                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                                                </div>
                                                <div>
                                                    <Label htmlFor="postalCode">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="country">Country</Label>
                                                <Select
                                                    id="country"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={(e) => handleSelectChange("country", e.target.value)}
                                                >
                                                    <option value="Germany">Germany</option>
                                                    <option value="Austria">Austria</option>
                                                    <option value="Switzerland">Switzerland</option>
                                                    <option value="France">France</option>
                                                    <option value="Netherlands">Netherlands</option>
                                                    <option value="Belgium">Belgium</option>
                                                </Select>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Method</h3>

                                            <RadioGroup className="space-y-3">
                                                <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <RadioItem
                                                        id="standard"
                                                        name="shippingMethod"
                                                        value="standard"
                                                        checked={formData.shippingMethod === "standard"}
                                                        onChange={(value) => handleSelectChange("shippingMethod", value)}
                                                        label="Standard Shipping (3-5 business days)"
                                                    />
                                                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(5.99)}</p>
                                                </div>
                                                <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <RadioItem
                                                        id="express"
                                                        name="shippingMethod"
                                                        value="express"
                                                        checked={formData.shippingMethod === "express"}
                                                        onChange={(value) => handleSelectChange("shippingMethod", value)}
                                                        label="Express Shipping (2-3 business days)"
                                                    />
                                                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(12.99)}</p>
                                                </div>
                                                <div className="flex items-center justify-between space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <RadioItem
                                                        id="overnight"
                                                        name="shippingMethod"
                                                        value="overnight"
                                                        checked={formData.shippingMethod === "overnight"}
                                                        onChange={(value) => handleSelectChange("shippingMethod", value)}
                                                        label="Overnight Shipping (1 business day)"
                                                    />
                                                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(19.99)}</p>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <Checkbox
                                            id="saveInfo"
                                            checked={formData.saveInfo}
                                            onChange={(checked) => handleCheckboxChange("saveInfo", checked)}
                                            label="Save this information for next time"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Cart
                                    </Button>
                                    <Button onClick={nextStep}>
                                        Continue to Payment
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                        <div>{renderCartSummary()}</div>
                    </div>
                )

            case "payment":
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card gradient="from-blue-500 to-indigo-500">
                                <CardHeader>
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-3">
                                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Information</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Review your billing details before proceeding to payment
                                    </p>
                                </CardHeader>
                                <CardContent>
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
                                            <Checkbox
                                                id="billingAddressSame"
                                                checked={formData.billingAddressSame}
                                                onChange={(checked) => handleCheckboxChange("billingAddressSame", checked)}
                                                label="Billing address is the same as shipping address"
                                            />

                                            {!formData.billingAddressSame && (
                                                <div className="mt-4 space-y-4 border rounded-xl p-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing Address</h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="billingFirstName">First Name</Label>
                                                            <Input
                                                                id="billingFirstName"
                                                                name="billingAddress.firstName"
                                                                value={formData.billingAddress?.firstName || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="billingLastName">Last Name</Label>
                                                            <Input
                                                                id="billingLastName"
                                                                name="billingAddress.lastName"
                                                                value={formData.billingAddress?.lastName || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="billingAddress">Street Address</Label>
                                                        <Input
                                                            id="billingAddress"
                                                            name="billingAddress.address"
                                                            value={formData.billingAddress?.address || ""}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="billingApartment">Apartment, Suite, etc. (optional)</Label>
                                                        <Input
                                                            id="billingApartment"
                                                            name="billingAddress.apartment"
                                                            value={formData.billingAddress?.apartment || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <Label htmlFor="billingCity">City</Label>
                                                            <Input
                                                                id="billingCity"
                                                                name="billingAddress.city"
                                                                value={formData.billingAddress?.city || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="billingState">State/Province</Label>
                                                            <Input
                                                                id="billingState"
                                                                name="billingAddress.state"
                                                                value={formData.billingAddress?.state || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="billingPostalCode">Postal Code</Label>
                                                            <Input
                                                                id="billingPostalCode"
                                                                name="billingAddress.postalCode"
                                                                value={formData.billingAddress?.postalCode || ""}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="billingCountry">Country</Label>
                                                        <Select
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
                                                        >
                                                            <option value="Germany">Germany</option>
                                                            <option value="Austria">Austria</option>
                                                            <option value="Switzerland">Switzerland</option>
                                                            <option value="France">France</option>
                                                            <option value="Netherlands">Netherlands</option>
                                                            <option value="Belgium">Belgium</option>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div>
                                            <Label htmlFor="notes">Order Notes (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes || ""}
                                                onChange={handleInputChange}
                                                placeholder="Special instructions for delivery or any other notes"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Shipping
                                    </Button>
                                    <Button onClick={nextStep}>
                                        Review Order
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                        <div>{renderCartSummary()}</div>
                    </div>
                )

            case "review":
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card gradient="from-amber-500 to-orange-500">
                                <CardHeader>
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl mr-3">
                                            <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Your Order</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Please review your order before proceeding to payment
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Items</h3>
                                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep("cart")}>
                                                    Edit
                                                </Button>
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

                                        <Separator />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping Information</h3>
                                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep("shipping")}>
                                                    Edit
                                                </Button>
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

                                        <Separator />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing Information</h3>
                                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep("payment")}>
                                                    Edit
                                                </Button>
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
                                                <Separator />
                                                <div>
                                                    <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Notes</h4>
                                                    <p className="text-gray-900 dark:text-white">{formData.notes}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Payment
                                    </Button>
                                    <Button onClick={nextStep} disabled={isProcessing}>
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
                                    </Button>
                                </CardFooter>
                            </Card>
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
                        <Card gradient="from-green-500 to-emerald-500">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h2>
                                <p className="text-gray-500 dark:text-gray-400">Thank you for your purchase</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                                        <Separator />
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
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" onClick={() => navigate("/account/orders")}>
                                    View Order Status
                                </Button>
                                <Button onClick={() => navigate("/store")}>Continue Shopping</Button>
                            </CardFooter>
                        </Card>
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
                    className={`rounded-lg shadow-lg p-4 flex items-start ${toast.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : toast.type === "error"
                            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        }`}
                >
                    <div
                        className={`flex-shrink-0 mr-3 ${toast.type === "success"
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
                            className={`text-sm font-medium ${toast.type === "success"
                                ? "text-green-800 dark:text-green-300"
                                : toast.type === "error"
                                    ? "text-red-800 dark:text-red-300"
                                    : "text-blue-800 dark:text-blue-300"
                                }`}
                        >
                            {toast.title}
                        </h3>
                        <p
                            className={`mt-1 text-sm ${toast.type === "success"
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

