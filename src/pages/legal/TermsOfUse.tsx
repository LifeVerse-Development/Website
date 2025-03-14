import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Use</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using this platform, you accept and agree to be bound by the terms and provisions of
                this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">2. User Eligibility</h2>
              <p className="text-gray-600 mb-4">
                You must be at least 13 years old to use this service. If you are under 18, you must have parental
                consent to use the platform. By using our service, you represent and warrant that you meet all
                eligibility requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You
                are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-600 mb-4">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming
                aware of any breach of security or unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">You agree not to use the service to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li className="mb-2">Violate any applicable laws or regulations</li>
                <li className="mb-2">Infringe upon the rights of others or violate their privacy</li>
                <li className="mb-2">Impersonate any person or entity</li>
                <li className="mb-2">Engage in any activity that interferes with or disrupts the service</li>
                <li className="mb-2">Attempt to gain unauthorized access to the service or related systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">5. User Content</h2>
              <p className="text-gray-600 mb-4">
                Our service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, videos, or other material. You are responsible for the content you post and its
                legality.
              </p>
              <p className="text-gray-600 mb-4">
                By posting content, you grant us the right to use, modify, publicly perform, publicly display,
                reproduce, and distribute such content on and through the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The service and its original content, features, and functionality are and will remain the exclusive
                property of our company and its licensors. The service is protected by copyright, trademark, and other
                laws.
              </p>
              <p className="text-gray-600 mb-4">
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of our company.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">7. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600 mb-4">
                Upon termination, your right to use the service will immediately cease. If you wish to terminate your
                account, you may simply discontinue using the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">9. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days' notice prior to any new terms taking
                effect.
              </p>
              <p className="text-gray-600 mb-4">
                By continuing to access or use our service after those revisions become effective, you agree to be bound
                by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us at support@example.com.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">Last updated: March 14, 2025</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsOfUse

