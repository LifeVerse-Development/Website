"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../stores/store"
import { clearCart } from "../stores/cartSlice"

const Checkout: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = total * 0.09
    const [address, setAddress] = useState<{
        fullName?: string
        middleName?: string
        lastName?: string
        street?: string
        houseNumber?: string
        city?: string
        state?: string
        country?: string
        postalCode?: string
    }>({})

    const dispatch = useDispatch()

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

    const handleCheckout = async () => {
        if (!address.fullName || !address.middleName || !address.lastName || !address.street || !address.houseNumber || !address.city || !address.state || !address.country || !address.postalCode) {
            alert("Bitte gib alle Adressdaten ein.")
            return
        }

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                body: JSON.stringify({
                    cartItems,
                    address,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json()

            if (data.success) {
                alert("Zahlung erfolgreich!")
                dispatch(clearCart())
            } else {
                alert("Fehler bei der Zahlung.")
            }
        } catch (error) {
            alert("Fehler beim Senden der Anfrage.")
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 dark:bg-green-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400">
                            Checkout
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Überprüfe deine Bestellung und fahre mit dem Abschluss fort.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
                >
                    <div className="h-2 bg-gradient-to-r from-green-500 to-yellow-500"></div>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bestellübersicht</h2>
                        <div className="flex flex-col space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-gray-900 dark:text-white">
                                    <span>{item.name}</span>
                                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                <span>Steuern</span>
                                <span>€{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-900 dark:text-white">
                                <span>Gesamt</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Address Section */}
                {!address.fullName || !address.middleName || !address.lastName || !address.street || !address.houseNumber || !address.city || !address.state || !address.country || !address.postalCode ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
                    >
                        <div className="h-2 bg-gradient-to-r from-green-500 to-yellow-500"></div>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Adressdaten</h2>
                            <form className="space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Vollständiger Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={address.fullName || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Max Mustermann"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Zusätzlicher Name</label>
                                    <input
                                        type="text"
                                        name="middleName"
                                        value={address.middleName || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Müller"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Nachname</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={address.lastName || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Mustermann"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Straße</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={address.street || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Musterstraße"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Hausnummer</label>
                                    <input
                                        type="text"
                                        name="houseNumber"
                                        value={address.houseNumber || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="1A"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Stadt</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Berlin"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Bundesland</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Berlin"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Land</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={address.country || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="Deutschland"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Postleitzahl</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={address.postalCode || ""}
                                        onChange={handleAddressChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-300 dark:bg-gray-700"
                                        placeholder="12345"
                                    />
                                </div>
                            </form>
                        </div>
                    </motion.div>
                ) : null}

                {/* Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="px-8 py-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Abschluss der Bestellung</h2>
                        <p className="text-white mb-6">Bereit, die Reise zu beginnen? Schließe deine Bestellung ab und starte LifeVerse.</p>
                        <button
                            onClick={handleCheckout}
                            className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300"
                        >
                            Jetzt bezahlen
                        </button>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    )
}

export default Checkout
