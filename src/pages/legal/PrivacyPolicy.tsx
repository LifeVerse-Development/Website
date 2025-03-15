"use client"

import { useState } from "react"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

const PrivacyPolicy = () => {
    const [openSection, setOpenSection] = useState<string | null>(null)

    const toggleSection = (section: string) => {
        if (openSection === section) {
            setOpenSection(null)
        } else {
            setOpenSection(section)
        }
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">Last updated: March 14, 2025</p>
                            <p>
                                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard
                                your information when you visit our website or use our services. Please read this privacy policy
                                carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("collection")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Collection of Your Information</h2>
                                <span className="text-2xl">{openSection === "collection" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "collection" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>

                                <div>
                                    <h3 className="font-semibold">Personal Data</h3>
                                    <p>
                                        Personally identifiable information, such as your name, shipping address, email address, and telephone
                                        number, that you voluntarily give to us when you register with the Site or when you choose to
                                        participate in various activities related to the Site.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Derivative Data</h3>
                                    <p>
                                        Information our servers automatically collect when you access the Site, such as your IP address, your
                                        browser type, your operating system, your access times, and the pages you have viewed directly before
                                        and after accessing the Site.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Financial Data</h3>
                                    <p>
                                        Financial information, such as data related to your payment method (e.g., valid credit card number,
                                        card brand, expiration date) that we may collect when you purchase, order, return, exchange, or
                                        request information about our services from the Site.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("use")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Use of Your Information</h2>
                                <span className="text-2xl">{openSection === "use" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "use" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized
                                    experience. Specifically, we may use information collected about you via the Site to:
                                </p>

                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Create and manage your account.</li>
                                    <li>Process your orders and manage your transactions.</li>
                                    <li>Send you a newsletter.</li>
                                    <li>Email you regarding your account or order.</li>
                                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                                    <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                                    <li>Notify you of updates to the Site.</li>
                                    <li>Resolve disputes and troubleshoot problems.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("disclosure")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Disclosure of Your Information</h2>
                                <span className="text-2xl">{openSection === "disclosure" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "disclosure" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    We may share information we have collected about you in certain situations. Your information may be
                                    disclosed as follows:
                                </p>

                                <div>
                                    <h3 className="font-semibold">By Law or to Protect Rights</h3>
                                    <p>
                                        If we believe the release of information about you is necessary to respond to legal process, to
                                        investigate or remedy potential violations of our policies, or to protect the rights, property, and
                                        safety of others, we may share your information as permitted or required by any applicable law, rule,
                                        or regulation.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Third-Party Service Providers</h3>
                                    <p>
                                        We may share your information with third parties that perform services for us or on our behalf,
                                        including payment processing, data analysis, email delivery, hosting services, customer service, and
                                        marketing assistance.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Marketing Communications</h3>
                                    <p>
                                        With your consent, or with an opportunity for you to withdraw consent, we may share your information
                                        with third parties for marketing purposes.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("security")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Security of Your Information</h2>
                                <span className="text-2xl">{openSection === "security" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "security" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px">
                                <p>
                                    We use administrative, technical, and physical security measures to help protect your personal
                                    information. While we have taken reasonable steps to secure the personal information you provide to us,
                                    please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                                    method of data transmission can be guaranteed against any interception or other type of misuse.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">If you have questions or comments about this Privacy Policy, please contact us at:</p>
                            <p>Your Company Name GmbH</p>
                            <p>Street Name 123</p>
                            <p>12345 City, Country</p>
                            <p>Email: privacy@yourcompany.com</p>
                            <p>Phone: +49 123 456789</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PrivacyPolicy

