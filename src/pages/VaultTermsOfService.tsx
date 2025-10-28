import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VaultTermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service for Vault</h1>

          <div className="text-sm text-gray-600 mb-8">
            <p><strong>Effective Date:</strong> January 1, 2025</p>
            <p><strong>Last Updated:</strong> January 1, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By downloading, installing, or using Vault ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Vault is a mobile application that helps pole vault athletes track their training sessions, analyze performance, and connect with other athletes. The App provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Jump tracking and analytics</li>
                <li>Video recording and storage</li>
                <li>Social features and feed</li>
                <li>Performance insights</li>
                <li>Equipment management</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You must provide accurate and complete information</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You are responsible for all activities under your account</li>
                <li>You may not share your account credentials</li>
                <li>You may not create multiple accounts</li>
                <li>We may suspend or terminate accounts that violate these Terms</li>
              </ul>
            </section>

            {/* Subscription and Payment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payment</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Subscription Tiers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Lite (Free):</strong> Limited features with restrictions</li>
                <li><strong>Athlete:</strong> Full features with monthly/annual payment</li>
                <li><strong>Athlete+:</strong> Premium features with priority support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payments are processed through App Store or Google Play</li>
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>Refunds are subject to App Store/Google Play policies</li>
                <li>Prices may change with notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Free Trial</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>New users receive a 14-day free trial of Athlete+</li>
                <li>You won't be charged during the trial period</li>
                <li>Cancel anytime before trial ends to avoid charges</li>
              </ul>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Your Content</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You retain ownership of content you upload, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Videos and photos</li>
                <li>Training data and notes</li>
                <li>Comments and posts</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 License to Us</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Store and display your content within the App</li>
                <li>Create backups and cached copies</li>
                <li>Share content as you direct (e.g., to feed, with friends)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Content Guidelines</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You agree not to upload content that:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violates any laws or regulations</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains harmful, offensive, or inappropriate material</li>
                <li>Includes personal information of minors</li>
                <li>Promotes dangerous activities</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-3">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Use the App for illegal purposes</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Reverse engineer or decompile the App</li>
                <li>Use automated systems or bots</li>
                <li>Interfere with the App's operation</li>
                <li>Sell or transfer your account</li>
              </ul>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your use of the App is subject to our Privacy Policy. By using the App, you consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Collection and processing of your data as described</li>
                <li>Storage of data on third-party servers (Firebase)</li>
                <li>Sharing of data for the purposes outlined</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Our Property</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                The App and its original content (excluding user content) are owned by us and protected by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Copyright laws</li>
                <li>Trademark laws</li>
                <li>Trade secret laws</li>
                <li>Other intellectual property rights</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Restrictions</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Copy, modify, or distribute the App</li>
                <li>Use our trademarks without permission</li>
                <li>Remove any proprietary notices</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-3">The App integrates with third-party services:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Firebase (Google) for infrastructure</li>
                <li>RevenueCat for subscriptions</li>
                <li>Weather APIs for conditions</li>
                <li>Video processing services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We are not responsible for third-party services' terms or practices.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 As-Is Basis</h3>
              <p className="text-gray-700 leading-relaxed uppercase font-semibold">
                THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.2 Athletic Activities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The App is not a substitute for professional coaching</li>
                <li>You assume all risks associated with pole vaulting</li>
                <li>Consult professionals before starting any training program</li>
                <li>We are not responsible for injuries or accidents</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.3 Accuracy</h3>
              <p className="text-gray-700 leading-relaxed mb-2">We do not guarantee:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Accuracy of analytics or measurements</li>
                <li>Availability of the App at all times</li>
                <li>That the App will meet your requirements</li>
                <li>Error-free or uninterrupted operation</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-3 uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                <li>We are not liable for loss of data, profits, or business opportunities</li>
              </ul>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree to indemnify and hold us harmless from any claims arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your use of the App</li>
                <li>Your violation of these Terms</li>
                <li>Your content or activities</li>
                <li>Your violation of any rights of another party</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.1 By You</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You may terminate your account at any time by:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Deleting your account through the App</li>
                <li>Contacting us at simen@stavhopp.no</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.2 By Us</h3>
              <p className="text-gray-700 leading-relaxed mb-2">We may terminate or suspend your account if you:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Fail to pay subscription fees</li>
                <li>Inactive for extended periods</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.3 Effect of Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-2">Upon termination:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your access to the App will cease</li>
                <li>Your data may be deleted (subject to legal requirements)</li>
                <li>You remain liable for any outstanding fees</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of Norway, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Norway.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">15.1 Informal Resolution</h3>
              <p className="text-gray-700 leading-relaxed">
                We prefer to resolve disputes informally. Contact us first at simen@stavhopp.no.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.2 Arbitration</h3>
              <p className="text-gray-700 leading-relaxed">
                If informal resolution fails, disputes will be resolved through binding arbitration, except where prohibited by law.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.3 Class Action Waiver</h3>
              <p className="text-gray-700 leading-relaxed">
                You waive the right to participate in class actions against us.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may update these Terms from time to time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>In-app notifications</li>
                <li>Email to your registered address</li>
                <li>Updating the "Last Updated" date</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Continued use after changes constitutes acceptance of new Terms.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Entire Agreement</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms, along with our Privacy Policy, constitute the entire agreement between you and us regarding the App.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">For questions about these Terms, contact us at:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> simen@stavhopp.no</p>
                <p className="text-gray-700"><strong>Support:</strong> simen@stavhopp.no</p>
              </div>
            </section>

            {/* App Store Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">20. Additional Terms for App Stores</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Apple App Store</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>These Terms are between you and us, not Apple</li>
                <li>Apple has no obligation to provide support</li>
                <li>Apple is not responsible for product claims</li>
                <li>Apple is a third-party beneficiary with rights to enforce these Terms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Google Play Store</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>These Terms are between you and us, not Google</li>
                <li>Google's Terms of Service also apply</li>
                <li>Google is not responsible for the App</li>
              </ul>
            </section>

            {/* Footer */}
            <section className="border-t border-gray-200 pt-8 mt-12">
              <p className="text-gray-600 italic">
                By using Vault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultTermsOfService;
