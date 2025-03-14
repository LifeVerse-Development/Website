"use client"

import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

const CookiePolicy = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Cookie Policy</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">Last updated: March 14, 2025</p>
                            <p>
                                This Cookie Policy explains how Your Company Name GmbH ("Company", "we", "us", and "our") uses cookies and
                                similar technologies to recognize you when you visit our website at www.yourcompany.com ("Website"). It
                                explains what these technologies are and why we use them, as well as your rights to control our use of
                                them.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
                        <div className="border-t pt-4">
                            <p>
                                Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                                Cookies are widely used by website owners in order to make their websites work, or to work more
                                efficiently, as well as to provide reporting information.
                            </p>
                            <p className="mt-4">
                                Cookies set by the website owner (in this case, Your Company Name GmbH) are called "first-party cookies".
                                Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies
                                enable third-party features or functionality to be provided on or through the website (e.g., advertising,
                                interactive content, and analytics). The parties that set these third-party cookies can recognize your
                                computer both when it visits the website in question and also when it visits certain other websites.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Why do we use cookies?</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">
                                We use first-party and third-party cookies for several reasons. Some cookies are required for technical
                                reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary"
                                cookies. Other cookies also enable us to track and target the interests of our users to enhance the
                                experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and
                                other purposes.
                            </p>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    The specific types of first and third-party cookies served through our Website and the purposes they
                                    perform:
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left">Type of Cookie</th>
                                                <th className="py-2 px-4 border-b text-left">Purpose</th>
                                                <th className="py-2 px-4 border-b text-left">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-2 px-4 border-b font-medium">Essential Cookies</td>
                                                <td className="py-2 px-4 border-b">
                                                    These cookies are strictly necessary to provide you with services available through our Website
                                                    and to use some of its features, such as access to secure areas.
                                                </td>
                                                <td className="py-2 px-4 border-b">Session / Persistent</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4 border-b font-medium">Performance & Functionality Cookies</td>
                                                <td className="py-2 px-4 border-b">
                                                    These cookies are used to enhance the performance and functionality of our Website but are
                                                    non-essential to their use. However, without these cookies, certain functionality may become
                                                    unavailable.
                                                </td>
                                                <td className="py-2 px-4 border-b">Session / Persistent</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4 border-b font-medium">Analytics & Customization Cookies</td>
                                                <td className="py-2 px-4 border-b">
                                                    These cookies collect information that is used either in aggregate form to help us understand
                                                    how our Website is being used or how effective our marketing campaigns are, or to help us
                                                    customize our Website for you.
                                                </td>
                                                <td className="py-2 px-4 border-b">Session / Persistent</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4 border-b font-medium">Advertising Cookies</td>
                                                <td className="py-2 px-4 border-b">
                                                    These cookies are used to make advertising messages more relevant to you. They perform functions
                                                    like preventing the same ad from continuously reappearing, ensuring that ads are properly
                                                    displayed for advertisers, and in some cases selecting advertisements that are based on your
                                                    interests.
                                                </td>
                                                <td className="py-2 px-4 border-b">Persistent</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">How can you control cookies?</h2>
                        <div className="border-t pt-4">
                            <p className="mb-4">
                                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by
                                setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select
                                which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are
                                strictly necessary to provide you with services.
                            </p>
                            <p className="mb-4">
                                The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to
                                reject cookies, you may still use our website though your access to some functionality and areas of our
                                website may be restricted. You may also set or amend your web browser controls to accept or refuse
                                cookies.
                            </p>
                            <p>
                                If you would like to find out more about cookies and your choices regarding them, please visit{" "}
                                <a
                                    href="http://www.allaboutcookies.org"
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    http://www.allaboutcookies.org
                                </a>{" "}
                                or{" "}
                                <a
                                    href="http://www.youronlinechoices.eu"
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    http://www.youronlinechoices.eu
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CookiePolicy

