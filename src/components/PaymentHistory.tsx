"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import {
    ShoppingBag,
    CreditCard,
    Package,
    CheckCircle,
    Clock,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Download,
    Eye,
} from "lucide-react"

interface PaymentItem {
    productId: string
    name: string
    price: number
    quantity: number
    image?: string
    description?: string
}

interface PaymentAddress {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
}

interface ShippingInfo {
    address: PaymentAddress
    method: string
}

interface CustomerInfo {
    name: string
    email: string
    phone?: string
}

interface Payment {
    _id: string
    identifier: string
    paymentMethod: string
    amount: number
    currency: string
    paymentDate: string
    transactionId: string
    status: "pending" | "completed" | "failed" | "refunded"
    customerInfo: CustomerInfo
    shippingInfo: ShippingInfo
    items: PaymentItem[]
    createdAt: string
    updatedAt: string
    userId?: string
}

interface PaymentHistoryProps {
    limit?: number
    onViewPayment?: (identifier: string) => void
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ limit, onViewPayment }) => {
    const { user, csrfToken } = useSelector((state: RootState) => state.auth)
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedPayment, setExpandedPayment] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
        limit: limit || 10,
    })

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user?.accessToken) return

            try {
                setLoading(true)
                // Use the /me endpoint to get the current user's payments
                const response = await fetch(
                    `http://localhost:3001/api/payments/me?page=${pagination.page}&limit=${pagination.limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                            csrfToken: csrfToken || "",
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error("Failed to fetch payment history")
                }

                const data = await response.json()
                console.log("API Response:", data)

                if (!data.payments || !Array.isArray(data.payments)) {
                    console.error("Unexpected data structure:", data)
                    throw new Error("Unexpected API response format")
                }

                setPayments(data.payments)
                setPagination({
                    ...pagination,
                    total: data.pagination.total,
                    pages: data.pagination.pages,
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchPayments()
    }, [user, csrfToken, pagination, pagination.page, pagination.limit])

    const toggleExpand = (paymentId: string) => {
        if (expandedPayment === paymentId) {
            setExpandedPayment(null)
        } else {
            setExpandedPayment(paymentId)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                )
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                )
            case "failed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Failed
                    </span>
                )
            case "refunded":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <CreditCard className="w-3 h-3 mr-1" />
                        Refunded
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {status}
                    </span>
                )
        }
    }

    const downloadInvoice = async (payment: Payment) => {
        // In a real application, this would generate and download an invoice PDF
        // For now, we'll just create a simple text representation
        const invoiceText = `
INVOICE
Order ID: ${payment.identifier}
Date: ${formatDate(payment.paymentDate)}
Status: ${payment.status}

Customer:
${payment.customerInfo.name}
${payment.customerInfo.email}
${payment.customerInfo.phone || ""}

Shipping Address:
${payment.shippingInfo.address.line1}
${payment.shippingInfo.address.line2 || ""}
${payment.shippingInfo.address.city}, ${payment.shippingInfo.address.state || ""} ${payment.shippingInfo.address.postalCode}
${payment.shippingInfo.address.country}
Shipping Method: ${payment.shippingInfo.method}

Items:
${payment.items.map((item) => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity, payment.currency)}`).join("\n")}

Total: ${formatCurrency(payment.amount, payment.currency)}
    `

        // Create a blob and download it
        const blob = new Blob([invoiceText], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice-${payment.identifier}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading payment history...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 my-4">
                <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
        )
    }

    if (payments.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment history</h3>
                <p className="text-gray-500 dark:text-gray-400">You haven't made any payments yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {payments.map((payment) => (
                <div
                    key={payment._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Payment Header */}
                    <div
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => toggleExpand(payment._id)}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Order #{payment.identifier.substring(0, 8)}
                                    </h3>
                                    <div className="ml-3">{getStatusBadge(payment.status)}</div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(payment.paymentDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                                {formatCurrency(payment.amount, payment.currency)}
                            </span>
                            {expandedPayment === payment._id ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Payment Details (Expanded) */}
                    {expandedPayment === payment._id && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Items */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                                    <div className="space-y-3">
                                        {payment.items.map((item, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                                                            {formatCurrency(item.price * item.quantity, payment.currency)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping & Payment Info */}
                                <div>
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Shipping Information</h4>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                                            <p className="text-gray-700 dark:text-gray-300 font-medium">{payment.customerInfo.name}</p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {payment.shippingInfo.address.line1}
                                                {payment.shippingInfo.address.line2 && `, ${payment.shippingInfo.address.line2}`}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {payment.shippingInfo.address.city},
                                                {payment.shippingInfo.address.state && ` ${payment.shippingInfo.address.state},`}
                                                {payment.shippingInfo.address.postalCode}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">{payment.shippingInfo.address.country}</p>
                                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                <span className="font-medium">Method:</span> {payment.shippingInfo.method}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Details</h4>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                                                <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                                                    {payment.paymentMethod}
                                                </span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                    {payment.transactionId.substring(0, 12)}...
                                                </span>
                                            </div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                    {formatDate(payment.paymentDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-900 dark:text-white">Total:</span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {formatCurrency(payment.amount, payment.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => downloadInvoice(payment)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Invoice
                                        </button>

                                        {onViewPayment && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onViewPayment(payment.identifier)
                                                }}
                                                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center mt-6">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                            disabled={pagination.page === pagination.pages}
                            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default PaymentHistory

