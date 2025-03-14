"use client"

import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

const Imprint = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Imprint</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
                        <div className="border-t pt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Company Name</h3>
                                <p>Your Company Name GmbH</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">Address</h3>
                                <p>Street Name 123</p>
                                <p>12345 City</p>
                                <p>Country</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">Contact</h3>
                                <p>Email: contact@yourcompany.com</p>
                                <p>Phone: +49 123 456789</p>
                                <p>Fax: +49 123 456788</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Legal Information</h2>
                        <div className="border-t pt-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Commercial Register</h3>
                                <p>Register Court: Amtsgericht City</p>
                                <p>Registration Number: HRB 12345</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">VAT Identification Number</h3>
                                <p>DE123456789</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">Responsible for Content</h3>
                                <p>John Doe (CEO)</p>
                                <p>Address same as above</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">
                                The European Commission provides a platform for online dispute resolution (OS):
                                <a
                                    href="https://ec.europa.eu/consumers/odr/"
                                    className="text-blue-600 hover:underline ml-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    https://ec.europa.eu/consumers/odr/
                                </a>
                            </p>
                            <p>
                                We are not willing or obliged to participate in dispute resolution proceedings before a consumer
                                arbitration board.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Imprint

