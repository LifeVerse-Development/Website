"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

// Define types for our data structures
interface Transaction {
    id: number
    type: "deposit" | "withdrawal" | "daily" | "work" | "purchase"
    amount: number
    timestamp: string
    description: string
}

interface FinancialData {
    bank: number
    wallet: number
    dailyRewardAvailable: boolean
    lastDailyReward: string
    workCooldown: number
    transactions: Transaction[]
}

interface WorkOption {
    id: string
    name: string
    reward: string
    cooldown: number
    description: string
}

interface NotificationState {
    show: boolean
    message: string
    type: "success" | "error"
}

interface CooldownState {
    [key: string]: number
}

// Mock user financial data
const initialFinancialData: FinancialData = {
    bank: 25000,
    wallet: 1500,
    dailyRewardAvailable: true,
    lastDailyReward: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    workCooldown: 0, // in seconds
    transactions: [
        {
            id: 1,
            type: "deposit",
            amount: 5000,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            description: "Deposit to bank",
        },
        {
            id: 2,
            type: "withdrawal",
            amount: 1000,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            description: "Withdrawal from bank",
        },
        {
            id: 3,
            type: "daily",
            amount: 500,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            description: "Daily reward claimed",
        },
        {
            id: 4,
            type: "work",
            amount: 750,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            description: "Worked as a miner",
        },
        {
            id: 5,
            type: "purchase",
            amount: -2500,
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            description: "Purchased health potion",
        },
    ],
}

// Work options
const workOptions: WorkOption[] = [
    {
        id: "mining",
        name: "Mining",
        reward: "200-500",
        cooldown: 300,
        description: "Mine resources for gold. Low risk, medium reward.",
    },
    {
        id: "hunting",
        name: "Hunting",
        reward: "300-800",
        cooldown: 600,
        description: "Hunt monsters for bounties. Medium risk, high reward.",
    },
    {
        id: "farming",
        name: "Farming",
        reward: "100-300",
        cooldown: 180,
        description: "Harvest crops for gold. No risk, low reward.",
    },
    {
        id: "fishing",
        name: "Fishing",
        reward: "150-400",
        cooldown: 240,
        description: "Catch fish to sell. Low risk, medium reward.",
    },
]

export const Economy = () => {
    const [financialData, setFinancialData] = useState<FinancialData>(initialFinancialData)
    const [activeTab, setActiveTab] = useState<string>("overview")
    const [transferAmount, setTransferAmount] = useState<string>("")
    const [transferDirection, setTransferDirection] = useState<string>("toBank")
    const [selectedWork, setSelectedWork] = useState<WorkOption | null>(null)
    const [workInProgress, setWorkInProgress] = useState<boolean>(false)
    const [workProgress, setWorkProgress] = useState<number>(0)
    const [notification, setNotification] = useState<NotificationState>({ show: false, message: "", type: "success" })
    const [cooldowns, setCooldowns] = useState<CooldownState>({})
    const [timeUntilDaily, setTimeUntilDaily] = useState<string>("")

    // Calculate time until next daily reward
    useEffect(() => {
        const calculateTimeUntilDaily = () => {
            if (financialData.dailyRewardAvailable) {
                setTimeUntilDaily("Available now")
                return
            }

            const lastDaily = new Date(financialData.lastDailyReward)
            const nextDaily = new Date(lastDaily.getTime() + 24 * 60 * 60 * 1000)
            const now = new Date()
            const diffMs = nextDaily.getTime() - now.getTime()

            if (diffMs <= 0) {
                setFinancialData((prev) => ({ ...prev, dailyRewardAvailable: true }))
                setTimeUntilDaily("Available now")
                return
            }

            const hours = Math.floor(diffMs / (1000 * 60 * 60))
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            setTimeUntilDaily(`${hours}h ${minutes}m`)
        }

        calculateTimeUntilDaily()
        const interval = setInterval(calculateTimeUntilDaily, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [financialData.dailyRewardAvailable, financialData.lastDailyReward])

    // Update work cooldowns
    useEffect(() => {
        const updateCooldowns = () => {
            const newCooldowns: CooldownState = { ...cooldowns }
            let updated = false

            Object.keys(newCooldowns).forEach((workId) => {
                if (newCooldowns[workId] > 0) {
                    newCooldowns[workId] -= 1
                    updated = true
                }
            })

            if (updated) {
                setCooldowns(newCooldowns)
            }
        }

        const interval = setInterval(updateCooldowns, 1000)
        return () => clearInterval(interval)
    }, [cooldowns])

    // Handle transfer between bank and wallet
    const handleTransfer = () => {
        const amount = Number.parseInt(transferAmount)
        if (isNaN(amount) || amount <= 0) {
            showNotification("Please enter a valid amount", "error")
            return
        }

        if (transferDirection === "toBank") {
            if (amount > financialData.wallet) {
                showNotification("Not enough gold in your wallet", "error")
                return
            }

            setFinancialData((prev) => ({
                ...prev,
                bank: prev.bank + amount,
                wallet: prev.wallet - amount,
                transactions: [
                    {
                        id: prev.transactions.length + 1,
                        type: "deposit",
                        amount,
                        timestamp: new Date().toISOString(),
                        description: "Deposit to bank",
                    },
                    ...prev.transactions,
                ],
            }))

            showNotification(`Successfully deposited ${amount} gold to your bank`, "success")
        } else {
            if (amount > financialData.bank) {
                showNotification("Not enough gold in your bank", "error")
                return
            }

            setFinancialData((prev) => ({
                ...prev,
                bank: prev.bank - amount,
                wallet: prev.wallet + amount,
                transactions: [
                    {
                        id: prev.transactions.length + 1,
                        type: "withdrawal",
                        amount,
                        timestamp: new Date().toISOString(),
                        description: "Withdrawal from bank",
                    },
                    ...prev.transactions,
                ],
            }))

            showNotification(`Successfully withdrew ${amount} gold to your wallet`, "success")
        }

        setTransferAmount("")
    }

    // Claim daily reward
    const claimDailyReward = () => {
        if (!financialData.dailyRewardAvailable) {
            showNotification("Daily reward not available yet", "error")
            return
        }

        const rewardAmount = 500

        setFinancialData((prev) => ({
            ...prev,
            wallet: prev.wallet + rewardAmount,
            dailyRewardAvailable: false,
            lastDailyReward: new Date().toISOString(),
            transactions: [
                {
                    id: prev.transactions.length + 1,
                    type: "daily",
                    amount: rewardAmount,
                    timestamp: new Date().toISOString(),
                    description: "Daily reward claimed",
                },
                ...prev.transactions,
            ],
        }))

        showNotification(`Claimed daily reward of ${rewardAmount} gold!`, "success")
    }

    // Start work
    const startWork = (work: WorkOption) => {
        if (cooldowns[work.id] && cooldowns[work.id] > 0) {
            showNotification(`You need to wait ${cooldowns[work.id]} seconds before working again`, "error")
            return
        }

        setSelectedWork(work)
        setWorkInProgress(true)
        setWorkProgress(0)

        // Simulate work progress
        const interval = setInterval(() => {
            setWorkProgress((prev) => {
                const newProgress = prev + 10
                if (newProgress >= 100) {
                    clearInterval(interval)
                    completeWork(work)
                    return 100
                }
                return newProgress
            })
        }, 500)
    }

    // Complete work
    const completeWork = (work: WorkOption) => {
        // Calculate random reward within range
        const [min, max] = work.reward.split("-").map(Number)
        const reward = Math.floor(Math.random() * (max - min + 1)) + min

        setFinancialData((prev) => ({
            ...prev,
            wallet: prev.wallet + reward,
            transactions: [
                {
                    id: prev.transactions.length + 1,
                    type: "work",
                    amount: reward,
                    timestamp: new Date().toISOString(),
                    description: `Worked as a ${work.name.toLowerCase()}`,
                },
                ...prev.transactions,
            ],
        }))

        // Set cooldown
        setCooldowns((prev) => ({
            ...prev,
            [work.id]: work.cooldown,
        }))

        setWorkInProgress(false)
        showNotification(`You earned ${reward} gold from ${work.name.toLowerCase()}!`, "success")
    }

    // Show notification
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "success" })
        }, 3000)
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    // Get transaction icon
    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "deposit":
                return "↑"
            case "withdrawal":
                return "↓"
            case "daily":
                return "🎁"
            case "work":
                return "⚒️"
            case "purchase":
                return "🛒"
            default:
                return "💰"
        }
    }

    // Get transaction color
    const getTransactionColor = (type: string, amount: number) => {
        if (amount < 0) return "text-red-600"
        switch (type) {
            case "deposit":
                return "text-blue-600"
            case "withdrawal":
                return "text-orange-600"
            case "daily":
                return "text-purple-600"
            case "work":
                return "text-green-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16 transition-colors duration-200">
                {/* Notification */}
                {notification.show && (
                    <div
                        className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                            } text-white`}
                    >
                        {notification.message}
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Economy</h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Manage your finances, earn rewards, and work for gold.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "overview"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                onClick={() => setActiveTab("overview")}
                            >
                                Overview
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "transfer" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("transfer")}
                            >
                                Transfer
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "work" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("work")}
                            >
                                Work
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("history")}
                            >
                                History
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Bank Account */}
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md p-6 text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium opacity-80">Bank Account</h3>
                                                    <p className="text-3xl font-bold mt-2">{financialData.bank.toLocaleString()} gold</p>
                                                </div>
                                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="mt-4 opacity-80">Secure storage for your gold with 2% interest every 30 days.</p>
                                            <button
                                                className="mt-4 px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                                                onClick={() => {
                                                    setActiveTab("transfer")
                                                    setTransferDirection("fromBank")
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        </div>

                                        {/* Wallet */}
                                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg shadow-md p-6 text-white">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium opacity-80">Wallet</h3>
                                                    <p className="text-3xl font-bold mt-2">{financialData.wallet.toLocaleString()} gold</p>
                                                </div>
                                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="mt-4 opacity-80">Your spending money for purchases and trades.</p>
                                            <button
                                                className="mt-4 px-4 py-2 bg-white text-yellow-700 rounded-md hover:bg-yellow-50 transition-colors"
                                                onClick={() => {
                                                    setActiveTab("transfer")
                                                    setTransferDirection("toBank")
                                                }}
                                            >
                                                Deposit
                                            </button>
                                        </div>
                                    </div>

                                    {/* Daily Reward */}
                                    <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-semibold">Daily Reward</h3>
                                                <p className="mt-2 opacity-80">Claim your daily reward of 500 gold!</p>
                                                <p className="mt-1 text-sm opacity-70">Next reward: {timeUntilDaily}</p>
                                            </div>
                                            <button
                                                className={`px-6 py-3 rounded-md font-medium ${financialData.dailyRewardAvailable
                                                        ? "bg-white text-purple-700 hover:bg-purple-50"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    } transition-colors`}
                                                onClick={claimDailyReward}
                                                disabled={!financialData.dailyRewardAvailable}
                                            >
                                                Claim Reward
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Transactions */}
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            {financialData.transactions.slice(0, 5).map((transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                                                        <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(transaction.timestamp)}
                                                        </p>
                                                    </div>
                                                    <div className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}>
                                                        {transaction.amount > 0 ? "+" : ""}
                                                        {transaction.amount} gold
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="p-4 text-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                    onClick={() => setActiveTab("history")}
                                                >
                                                    View All Transactions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transfer Tab */}
                            {activeTab === "transfer" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Transfer Gold</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <h3 className="font-medium text-blue-800 dark:text-blue-200">Bank Balance</h3>
                                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                                {financialData.bank.toLocaleString()} gold
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Wallet Balance</h3>
                                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                                                {financialData.wallet.toLocaleString()} gold
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Direction</label>
                                            <div className="flex">
                                                <button
                                                    className={`flex-1 py-3 px-4 ${transferDirection === "toBank"
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        } rounded-l-md transition-colors`}
                                                    onClick={() => setTransferDirection("toBank")}
                                                >
                                                    Wallet to Bank
                                                </button>
                                                <button
                                                    className={`flex-1 py-3 px-4 ${transferDirection === "fromBank"
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        } rounded-r-md transition-colors`}
                                                    onClick={() => setTransferDirection("fromBank")}
                                                >
                                                    Bank to Wallet
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Transfer</label>
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={transferDirection === "toBank" ? financialData.wallet : financialData.bank}
                                                    value={transferAmount}
                                                    onChange={(e) => setTransferAmount(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter amount"
                                                />
                                                <button
                                                    className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200 transition-colors"
                                                    onClick={() =>
                                                        setTransferAmount(
                                                            transferDirection === "toBank"
                                                                ? financialData.wallet.toString()
                                                                : financialData.bank.toString(),
                                                        )
                                                    }
                                                >
                                                    Max
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                onClick={handleTransfer}
                                            >
                                                Transfer Gold
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Work Tab */}
                            {activeTab === "work" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Work for Gold</h2>

                                    {workInProgress ? (
                                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                                Working as a {selectedWork?.name || "worker"}...
                                            </h3>

                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                                                <div
                                                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                                    style={{ width: `${workProgress}%` }}
                                                ></div>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                Please wait while you complete your work. You'll earn between {selectedWork?.reward || "0-0"}{" "}
                                                gold.
                                            </p>

                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    After completion, this work will have a cooldown of {selectedWork?.cooldown || 0} seconds.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {workOptions.map((work) => (
                                                <div
                                                    key={work.id}
                                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                                >
                                                    <div className="p-5">
                                                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">{work.name}</h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{work.description}</p>

                                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Reward</p>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">{work.reward} gold</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Cooldown</p>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {cooldowns[work.id] && cooldowns[work.id] > 0
                                                                        ? `${cooldowns[work.id]}s`
                                                                        : `${work.cooldown}s`}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            className={`mt-4 w-full py-2 rounded-md ${cooldowns[work.id] && cooldowns[work.id] > 0
                                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                    : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                                                }`}
                                                            onClick={() => startWork(work)}
                                                            disabled={!!(cooldowns[work.id] && cooldowns[work.id] > 0)}
                                                        >
                                                            {cooldowns[work.id] && cooldowns[work.id] > 0
                                                                ? `On Cooldown (${cooldowns[work.id]}s)`
                                                                : `Start Working`}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* History Tab */}
                            {activeTab === "history" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Transaction History</h2>

                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        {financialData.transactions.length > 0 ? (
                                            financialData.transactions.map((transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                                                        <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(transaction.timestamp)}
                                                        </p>
                                                    </div>
                                                    <div className={`font-medium ${getTransactionColor(transaction.type, transaction.amount)}`}>
                                                        {transaction.amount > 0 ? "+" : ""}
                                                        {transaction.amount} gold
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions found.</div>
                                        )}
                                    </div>
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

export default Economy

