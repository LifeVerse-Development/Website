"use client"

import { useState } from "react"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

const GeneralTermsAndConditions = () => {
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
                    <h1 className="text-4xl font-bold mb-8 text-center">General Terms and Conditions</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">Last updated: March 14, 2025</p>
                            <p>
                                These General Terms and Conditions ("Terms") govern your access to and use of our website, products, and
                                services. Please read these Terms carefully before using our services. By accessing or using our services,
                                you agree to be bound by these Terms.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div
                            className="bg-white shadow-md rounded-lg p-6 cursor-pointer"
                            onClick={() => toggleSection("definitions")}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Definitions</h2>
                                <span className="text-2xl">{openSection === "definitions" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "definitions" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <div>
                                    <h3 className="font-semibold">"Company", "We", "Us", "Our"</h3>
                                    <p>Refers to Your Company Name GmbH, Street Name 123, 12345 City, Country.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">"Services"</h3>
                                    <p>Refers to the website, applications, products, and services provided by the Company.</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">"You", "Your"</h3>
                                    <p>
                                        Refers to the individual accessing or using the Services, or the company, or other legal entity on
                                        behalf of which such individual is accessing or using the Services, as applicable.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">"Website"</h3>
                                    <p>Refers to our website, accessible from www.yourcompany.com</p>
                                </div>
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
                                    When you create an account with us, you must provide us information that is accurate, complete, and
                                    current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                                    termination of your account on our Services.
                                </p>

                                <p>
                                    You are responsible for safeguarding the password that you use to access the Services and for any
                                    activities or actions under your password, whether your password is with our Services or a third-party
                                    service.
                                </p>

                                <p>
                                    You agree not to disclose your password to any third party. You must notify us immediately upon becoming
                                    aware of any breach of security or unauthorized use of your account.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("ip")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Intellectual Property</h2>
                                <span className="text-2xl">{openSection === "ip" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "ip" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px space-y-4">
                                <p>
                                    The Services and their original content, features, and functionality are and will remain the exclusive
                                    property of the Company and its licensors. The Services are protected by copyright, trademark, and other
                                    laws of both the Country and foreign countries.
                                </p>

                                <p>
                                    Our trademarks and trade dress may not be used in connection with any product or service without the
                                    prior written consent of the Company.
                                </p>
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
                                    To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be
                                    liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not
                                    limited to, damages for loss of profits, loss of data or other information, for business interruption,
                                    for personal injury, loss of privacy arising out of or in any way related to the use of or inability to
                                    use the Services, third-party software and/or third-party hardware used with the Services, or otherwise
                                    in connection with any provision of these Terms), even if the Company or any supplier has been advised
                                    of the possibility of such damages and even if the remedy fails of its essential purpose.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer" onClick={() => toggleSection("law")}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Governing Law</h2>
                                <span className="text-2xl">{openSection === "law" ? "−" : "+"}</span>
                            </div>
                        </div>

                        {openSection === "law" && (
                            <div className="bg-white shadow-md rounded-b-lg p-6 border-t mt-px">
                                <p>
                                    These Terms shall be governed and construed in accordance with the laws of Country, without regard to
                                    its conflict of law provisions.
                                </p>

                                <p className="mt-4">
                                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                                    rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                                    provisions of these Terms will remain in effect.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
                                is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What
                                constitutes a material change will be determined at our sole discretion.
                            </p>
                            <p>
                                By continuing to access or use our Services after those revisions become effective, you agree to be bound
                                by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the
                                website and the Services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default GeneralTermsAndConditions

