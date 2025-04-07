import type React from "react"
import { Link } from "react-router-dom"
import { Instagram, Twitter, Youtube, Twitch } from "lucide-react"
import { FaDiscord } from 'react-icons/fa';

const TikTokIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
)

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white py-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-300/10 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-12 -left-24 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Logo and Social Icons */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-full p-1">
                                    <img
                                        src="/logo.png"
                                        alt="Logo"
                                        className="h-10 w-10 rounded-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = "/placeholder.svg?height=40&width=40"
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                LifeVerse Studios
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            The first realism game which covers the real life.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {/* Social Media Icons */}
                            <SocialIcon
                                href="https://instagram.com/lifeverse_game"
                                icon={<Instagram size={18} />}
                                label="Instagram"
                                color="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
                            />
                            <SocialIcon
                                href="https://tiktok.com/@lifeverse_game"
                                icon={<TikTokIcon size={18} />}
                                label="TikTok"
                                color="bg-black dark:bg-white dark:text-black"
                            />
                            <SocialIcon href="https://youtube.com/c/lifeverse_game" icon={<Youtube size={18} />} label="YouTube" color="bg-red-600" />
                            <SocialIcon href="https://twitch.tv/@lifeverse_game" icon={<Twitch size={18} />} label="Twitch" color="bg-purple-600" />
                            <SocialIcon
                                href="https://discord.com/lifeverse_game"
                                icon={<FaDiscord size={18} />}
                                label="Discord"
                                color="bg-indigo-600"
                            />
                            <SocialIcon href="https://twitter.com/lifeverse_game" icon={<Twitter size={18} />} label="Twitter" color="bg-blue-500" />
                        </div>
                    </div>

                    {/* Important Links */}
                    <div className="space-y-6">
                        <h4 className="text-base font-semibold relative inline-block">
                            <span className="relative z-10">Important Links</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500/0 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink to="/news">News</FooterLink>
                            <FooterLink to="/downloads">Downloads</FooterLink>
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Downloads Links */}
                    <div className="space-y-6">
                        <h4 className="text-base font-semibold relative inline-block">
                            <span className="relative z-10">Downloads</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500/0 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink to="/downloads/api">Download API</FooterLink>
                            <FooterLink to="/downloads/discord_bot">Download Discord Bot</FooterLink>
                            <FooterLink to="/downloads/software">Download Software</FooterLink>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6">
                        <h4 className="text-base font-semibold relative inline-block">
                            <span className="relative z-10">Legal</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500/0 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink to="/legal/imprint">Imprint</FooterLink>
                            <FooterLink to="/legal/privacy_policy">Privacy Policy</FooterLink>
                            <FooterLink to="/legal/general_terms_and_conditions">General Terms and Conditions</FooterLink>
                            <FooterLink to="/legal/terms_of_service">Terms of Service</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

                {/* Copyright Line */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()}{" "}
                        <strong>
                            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                LifeVerse Studios
                            </Link>
                        </strong>
                        . All rights reserved.
                    </p>
                    <p className="mt-2 md:mt-0">Made with ❤️ for our community.</p>
                </div>
            </div>
        </footer>
    )
}

// Helper Components
interface SocialIconProps {
    href: string
    icon: React.ReactNode
    label: string
    color: string
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label, color }) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="group">
            <div
                className={`w-9 h-9 flex items-center justify-center rounded-full ${color} text-white shadow-sm transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
            >
                {icon}
            </div>
        </a>
    )
}

interface FooterLinkProps {
    to: string
    children: React.ReactNode
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
    return (
        <li>
            <Link
                to={to}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
            >
                <span className="w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                {children}
            </Link>
        </li>
    )
}

export default Footer

