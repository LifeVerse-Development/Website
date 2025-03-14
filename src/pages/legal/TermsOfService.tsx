"use client"

import { useState } from "react"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

const TermsOfService = () => {
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
                    <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">Last updated: March 14, 2025</p>
                            <p>
                                These Terms of Service ("Terms") govern your use of the services offered by Your Company Name GmbH
                                ("Company", "we", "us", or "our") through our website, applications, and other platforms (collectively,
                                the "Services"). Please read these Terms carefully before using our Services.
                            </p>
                            <p className="mt-4">
                                By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of
                                the Terms, you may not access the Services.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("services")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Services Description</h2>
                                <span className="text-2xl">{openSection === "services" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "services" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    The Company offers a platform that allows users to [describe your services here]. The Services may
                                    include:
                                </p>

                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Access to our website and mobile applications</li>
                                    <li>Account creation and management</li>
                                    <li>Content creation, sharing, and management</li>
                                    <li>Communication with other users</li>
                                    <li>Purchase of products or services</li>
                                    <li>Customer support</li>
                                </ul>

                                <p className="mt-4">
                                    We reserve the right to modify, suspend, or discontinue the Services (or any part thereof) at any time,
                                    with or without notice. We shall not be liable to you or to any third party for any modification,
                                    suspension, or discontinuance of the Services.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("accounts")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">User Accounts</h2>
                                <span className="text-2xl">{openSection === "accounts" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "accounts" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    To access certain features of the Services, you may be required to create an account. You agree to
                                    provide accurate, current, and complete information during the registration process and to update such
                                    information to keep it accurate, current, and complete.
                                </p>

                                <p>
                                    You are responsible for safeguarding your account credentials and for all activities that occur under
                                    your account. You agree to notify us immediately of any unauthorized use of your account or any other
                                    breach of security.
                                </p>

                                <p>
                                    We reserve the right to disable any user account at any time in our sole discretion for any or no
                                    reason, including if, in our opinion, you have violated any provision of these Terms.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("content")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">User Content</h2>
                                <span className="text-2xl">{openSection === "content" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "content" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    Our Services may allow you to post, link, store, share, and otherwise make available certain
                                    information, text, graphics, videos, or other material ("User Content"). You are responsible for the
                                    User Content that you post on or through the Services, including its legality, reliability, and
                                    appropriateness.
                                </p>

                                <p>By posting User Content on or through the Services, you represent and warrant that:</p>

                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        The User Content is yours (you own it) or you have the right to use it and grant us the rights and
                                        license as provided in these Terms.
                                    </li>
                                    <li>
                                        The posting of your User Content on or through the Services does not violate the privacy rights,
                                        publicity rights, copyrights, contract rights, or any other rights of any person or entity.
                                    </li>
                                    <li>
                                        The User Content does not contain any material that is defamatory, obscene, indecent, abusive,
                                        offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable.
                                    </li>
                                </ul>

                                <p className="mt-4">
                                    We reserve the right to remove any User Content from the Services at any time, for any reason, without
                                    notice.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("payments")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Payments and Subscriptions</h2>
                                <span className="text-2xl">{openSection === "payments" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "payments" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    Some of our Services may require payment of fees. You agree to pay all fees and charges incurred in
                                    connection with your use of the Services at the rates in effect when the charges were incurred.
                                </p>

                                <p>If you subscribe to any of our paid Services, you agree to the following terms:</p>

                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Subscription fees are billed in advance on a monthly or annual basis, depending on the subscription
                                        plan you select.
                                    </li>
                                    <li>
                                        Your subscription will automatically renew at the end of each subscription period unless you cancel it
                                        before the renewal date.
                                    </li>
                                    <li>
                                        You may cancel your subscription at any time through your account settings or by contacting our
                                        customer support.
                                    </li>
                                    <li>
                                        If you cancel your subscription, you will continue to have access to the paid Services until the end
                                        of your current subscription period.
                                    </li>
                                    <li>We do not provide refunds for partial subscription periods.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("liability")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Limitation of Liability</h2>
                                <span className="text-2xl">{openSection === "liability" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "liability" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px">
                                <p>
                                    To the maximum extent permitted by applicable law, in no event shall the Company, its affiliates,
                                    directors, employees, agents, or licensors be liable for any indirect, punitive, incidental, special,
                                    consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill,
                                    use, data, or other intangible losses, that result from the use of, or inability to use, the Services.
                                </p>

                                <p className="mt-4">
                                    In no event will our aggregate liability for any and all claims related to the Services exceed the
                                    greater of €100 or the amounts you paid to the Company for the past three months of the Services in
                                    question.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
                            <p>Your Company Name GmbH</p>
                            <p>Street Name 123</p>
                            <p>12345 City, Country</p>
                            <p>Email: legal@yourcompany.com</p>
                            <p>Phone: +49 123 456789</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default TermsOfService

