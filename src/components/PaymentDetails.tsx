"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import { Package, CheckCircle, Clock, AlertTriangle, ArrowLeft, Download, Printer } from "lucide-react"

interface PaymentDetailsProps {
    paymentId: string
    onBack: () => void
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentId, onBack }) => {
    const { user, csrfToken } = useSelector((state: RootState) => state.auth)
    const [payment, setPayment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!user?.accessToken) return

            try {
                setLoading(true)
                // Use the /:identifier endpoint to get the payment details
                const response = await fetch(`http://localhost:3001/api/payments/${paymentId}`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        csrfToken: csrfToken || "",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch payment details")
                }

                const data = await response.json()
                setPayment(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchPaymentDetails()
    }, [paymentId, user, csrfToken])

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
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {status}
                    </span>
                )
        }
    }

    const downloadInvoice = async () => {
        if (!payment) return

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
${payment.items.map((item: any) => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity, payment.currency)}`).join("\n")}

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

    const printInvoice = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error || !payment) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 my-4">
                <p className="text-red-700 dark:text-red-300">{error || "Payment not found"}</p>
                <button onClick={onBack} className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to payment history
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Payment Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </button>
                        <div>
                            <div className="flex items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Order #{payment.identifier.substring(0, 8)}
                                </h2>
                                <div className="ml-3">{getStatusBadge(payment.status)}</div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(payment.paymentDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0 space-x-3">
                        <button
                            onClick={printInvoice}
                            className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </button>
                        <button
                            onClick={downloadInvoice}
                            className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Content */}
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                        >
                                            Product
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                        >
                                            Quantity
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                        >
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {payment.items.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                className="h-8 w-8 rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(item.price * item.quantity, payment.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                                        >
                                            Subtotal
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Customer & Shipping Info */}
                    <div>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Information</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-900 dark:text-white font-medium">{payment.customerInfo.name}</p>
                                <p className="text-gray-600 dark:text-gray-400">{payment.customerInfo.email}</p>
                                {payment.customerInfo.phone && (
                                    <p className="text-gray-600 dark:text-gray-400">{payment.customerInfo.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {payment.shippingInfo.method.charAt(0).toUpperCase() + payment.shippingInfo.method.slice(1)} Shipping
                                </p>
                                <div className="mt-2">
                                    <p className="text-gray-600 dark:text-gray-400">{payment.customerInfo.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {payment.shippingInfo.address.line1}
                                        {payment.shippingInfo.address.line2 && <br />}
                                        {payment.shippingInfo.address.line2}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {payment.shippingInfo.address.city},
                                        {payment.shippingInfo.address.state && ` ${payment.shippingInfo.address.state},`}
                                        {payment.shippingInfo.address.postalCode}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">{payment.shippingInfo.address.country}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Information</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                                    <span className="text-gray-900 dark:text-white font-medium capitalize">{payment.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {payment.transactionId.substring(0, 12)}...
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(payment.paymentDate)}</span>
                                </div>
                                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white font-medium">Total:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatCurrency(payment.amount, payment.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentDetails

