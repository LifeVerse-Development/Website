"use client";
import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon, ChevronDownIcon, Bars3Icon } from "@heroicons/react/24/outline";
import ThemeToggle from "../components/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";

const Documentation = () => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [isCrudOpen, setIsCrudOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [isGuildsOpen, setIsGuildsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const sections = [
        {
            title: "Introduction",
            items: [
                { name: "What is this?", id: "what-is-this" },
                { name: "Getting Started", id: "getting-started" },
            ],
        },
        {
            title: "Installation",
            items: [
                { name: "System Requirements", id: "system-requirements" },
                { name: "Installation Process", id: "installation-process" },
            ],
        },
        {
            title: "API Reference",
            items: [
                { name: "Authentication", id: "auth" },
                { name: "Routes", id: "routes" },
            ],
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md p-4">
                <div className="flex justify-between items-center">
                    {/* Left side: Logo */}
                    <div className="flex items-center space-x-4">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                    </div>

                    {/* Center: Dropdowns for CRUD, Verification, Guilds */}
                    <div className="flex space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsCrudOpen(!isCrudOpen)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                            >
                                <span>CRUD</span>
                                {isCrudOpen ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                )}
                            </button>
                            {isCrudOpen && (
                                <div className="absolute left-0 mt-2 bg-gray-200 rounded-md shadow-lg w-48 dark:bg-gray-700">
                                    <ul>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Create</li>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Read</li>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Update</li>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Delete</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsVerificationOpen(!isVerificationOpen)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                            >
                                <span>Verification</span>
                                {isVerificationOpen ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                )}
                            </button>
                            {isVerificationOpen && (
                                <div className="absolute left-0 mt-2 bg-gray-200 rounded-md shadow-lg w-48 dark:bg-gray-700">
                                    <ul>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">User Verification</li>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Admin Verification</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsGuildsOpen(!isGuildsOpen)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                            >
                                <span>Guilds</span>
                                {isGuildsOpen ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                )}
                            </button>
                            {isGuildsOpen && (
                                <div className="absolute left-0 mt-2 bg-gray-200 rounded-md shadow-lg w-48 dark:bg-gray-700">
                                    <ul>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Manage Guilds</li>
                                        <li className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">Guild Settings</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side: Profile and Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {isAuthenticated && user && (
                            <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <span className="text-gray-900 dark:text-white">{user.username}</span>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <div className="flex flex-1">
                {/* Sidebar Toggle Button (Hamburger Menu) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed top-24 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-md"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                {/* Sidebar */}
                <aside
                    className={`w-64 bg-white dark:bg-gray-800 shadow-lg p-4 ${isSidebarOpen ? 'block' : 'hidden'} md:block animate-slideIn`}
                >
                    <nav>
                        {sections.map((section) => (
                            <Disclosure key={section.title} as="div" className="mb-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex items-center justify-between w-full p-2 text-left rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {section.title}
                                            </span>
                                            {open ? (
                                                <ChevronDownIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                            ) : (
                                                <ChevronRightIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                                            )}
                                        </Disclosure.Button>
                                        <Disclosure.Panel>
                                            <ul className="mt-2 pl-4 space-y-1">
                                                {section.items.map((item) => (
                                                    <li key={item.id}>
                                                        <button
                                                            onClick={() => setSelectedSection(item.id)}
                                                            className={`block w-full text-left p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 ${selectedSection === item.id ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
                                                        >
                                                            <span className="text-gray-900 dark:text-white">{item.name}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    {selectedSection ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fadeIn">
                            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                {sections.flatMap((section) => section.items).find((item) => item.id === selectedSection)?.name}
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300">
                                Here could be the documentation content for {selectedSection}...
                            </p>
                        </div>
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-center">
                            Select a category from the sidebar.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Documentation;
