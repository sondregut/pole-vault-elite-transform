import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VaultPrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/vault">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Vault
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy for Vault</h1>

          <div className="text-sm text-gray-600 mb-8">
            <p><strong>Effective Date:</strong> January 1, 2025</p>
            <p><strong>Last Updated:</strong> January 1, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Vault ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using our app, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not use the app.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> Email address, name, username, profile photo</li>
                <li><strong>Athletic Data:</strong> Jump heights, ratings, pole specifications, session data</li>
                <li><strong>Content:</strong> Videos of jumps, photos, notes, and comments</li>
                <li><strong>Location Data:</strong> Training locations (when you choose to add them)</li>
                <li><strong>Communication:</strong> Messages, friend requests, and feed posts</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Usage Data:</strong> App features used, session duration, interaction data</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
                <li><strong>Performance Data:</strong> App crashes, performance metrics, error logs</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Information from Third Parties</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Weather Data:</strong> Weather conditions from third-party APIs (when location is provided)</li>
                <li><strong>Payment Information:</strong> Subscription data from RevenueCat/App Store/Google Play (we don't store credit card details)</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Provide Services:</strong> Enable jump tracking, video storage, and performance analytics</li>
                <li><strong>Improve Performance:</strong> Analyze your athletic progress and provide insights</li>
                <li><strong>Communication:</strong> Send notifications about friend requests, comments, and app updates</li>
                <li><strong>Safety:</strong> Detect and prevent fraud, abuse, or security incidents</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We <strong>DO NOT</strong> sell your personal information. We may share your information in these limited circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 With Your Consent</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Social Features:</strong> Posts shared to feed, friend connections (only with your explicit action)</li>
                <li><strong>Coaches/Teams:</strong> If you choose to share your data with coaches or teammates</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Firebase (Google):</strong> Data storage, authentication, and hosting</li>
                <li><strong>RevenueCat:</strong> Subscription management</li>
                <li><strong>Weather API:</strong> Location-based weather data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose information if required by law, court order, or government request.
              </p>
            </section>

            {/* Data Storage and Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Storage and Security</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Storage Location</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Data is stored on Firebase (Google Cloud Platform) servers</li>
                <li>Primary data centers are located in the United States</li>
                <li>Videos and images are stored in Firebase Storage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Security Measures</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Encryption:</strong> Data is encrypted in transit using TLS/SSL</li>
                <li><strong>Authentication:</strong> Secure authentication via Firebase Auth</li>
                <li><strong>Access Controls:</strong> Role-based access controls and security rules</li>
                <li><strong>Regular Updates:</strong> Security patches and updates are applied regularly</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Data Retention</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                <li><strong>Deleted Accounts:</strong> Data removed within 30 days of account deletion</li>
                <li><strong>Videos:</strong> Permanently deleted when you delete them or your account</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Access and Portability</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access your personal data</li>
                <li>Export your data in a portable format</li>
                <li>Request a copy of all data we have about you</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Correction</h3>
              <p className="text-gray-700 leading-relaxed">
                You can update or correct your information through the app settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 Deletion</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You can:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Delete individual jumps, sessions, or videos</li>
                <li>Request complete account deletion (removes all data)</li>
                <li>Contact us at privacy@stavhopp.no for deletion requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.4 Opt-Out</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You can opt-out of:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Push notifications (in device settings)</li>
                <li>Email communications (via unsubscribe links)</li>
                <li>Location tracking (don't add location to sessions)</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our app is not intended for children under 13. We do not knowingly collect information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                If you access our app from outside the United States, your information may be transferred to and processed in the United States. By using our app, you consent to this transfer.
              </p>
            </section>

            {/* California Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. California Privacy Rights (CCPA)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">California residents have additional rights:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of sale (we don't sell data)</li>
                <li>Right to non-discrimination</li>
              </ul>
            </section>

            {/* GDPR Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. European Privacy Rights (GDPR)</h2>
              <p className="text-gray-700 leading-relaxed mb-3">If you are in the European Economic Area (EEA), you have rights under GDPR:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Legal Basis:</strong> We process data based on consent or legitimate interests</li>
                <li><strong>Data Protection Officer:</strong> Contact at dpo@polevaulttracker.com</li>
                <li><strong>Supervisory Authority:</strong> You may lodge complaints with your local authority</li>
              </ul>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We may update this privacy policy from time to time. We will notify you of any changes by:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Posting the new policy in the app</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending notification for material changes</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-3">If you have questions about this privacy policy or our practices, contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@stavhopp.no</p>
                <p className="text-gray-700"><strong>Data Protection Officer:</strong> dpo@stavhopp.no</p>
              </div>
            </section>

            {/* Regional Info */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Additional Information for Specific Regions</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">For European Users</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Legal Basis for Processing:</strong> Consent (Article 6.1.a GDPR) and Legitimate Interests (Article 6.1.f GDPR)</li>
                <li><strong>Right to Withdraw Consent:</strong> You may withdraw consent at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">For California Users</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Shine the Light Law:</strong> California residents may request information about disclosure to third parties</li>
                <li><strong>Do Not Track:</strong> Our app does not respond to Do Not Track signals</li>
              </ul>
            </section>

            {/* Footer */}
            <section className="border-t border-gray-200 pt-8 mt-12">
              <p className="text-gray-600 italic">
                By using Vault, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultPrivacyPolicy;
