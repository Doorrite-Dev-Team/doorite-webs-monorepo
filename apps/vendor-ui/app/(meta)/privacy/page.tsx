// app/privacy/page.tsx
"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-600">
                Last updated: December 27, 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Doorrite, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, store, and share your data
                as a vendor on our platform operating in Nigeria.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect the following information from vendors:
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Business Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Business name and registration details</li>
                <li>Business address and location</li>
                <li>Business category and type of products/services</li>
                <li>Business logo and images</li>
                <li>Operating hours and delivery information</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Contact Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Email address</li>
                <li>Phone number</li>
                <li>Business contact details</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Account Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Username and password (encrypted)</li>
                <li>Account verification status</li>
                <li>Account preferences and settings</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Financial Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Bank account details for payments</li>
                <li>Transaction history</li>
                <li>Tax identification information</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Usage Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Order history and performance metrics</li>
                <li>Customer reviews and ratings</li>
                <li>Platform usage and activity logs</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and manage your vendor account</li>
                <li>Process orders and facilitate deliveries</li>
                <li>Process payments and manage your wallet</li>
                <li>Verify your business credentials and compliance</li>
                <li>Communicate important updates and notifications</li>
                <li>Provide customer support and resolve disputes</li>
                <li>Improve our platform and services</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Information Sharing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We share your information only in the following circumstances:
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                With Customers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your business name, logo, location, ratings, and product
                information are visible to customers on our platform.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                With Riders
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Delivery riders receive your business location and contact
                information to facilitate order pickup.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                With Service Providers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We share information with third-party service providers who help
                us operate our platform, including payment processors, hosting
                services, and analytics providers.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                For Legal Compliance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose information to comply with Nigerian laws,
                regulations, court orders, or legal processes.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                Business Transfers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If Doorrite is involved in a merger, acquisition, or sale of
                assets, your information may be transferred to the new entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Data Storage and Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Data is encrypted in transit and at rest</li>
                <li>Secure servers with regular security updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular security audits and monitoring</li>
                <li>Data is stored on servers located in secure facilities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                While we take reasonable measures to protect your data, no
                system is completely secure. You are responsible for maintaining
                the confidentiality of your account credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                As a vendor, you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data (subject to legal requirements)
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain data processing
                  activities
                </li>
                <li>
                  <strong>Data Portability:</strong> Receive your data in a
                  portable format
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Opt-out of marketing
                  communications
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, contact us at doorrite.info@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as your account is active
                or as needed to provide services. After account closure, we may
                retain certain information for legal, tax, audit, and dispute
                resolution purposes. Financial records are retained for 7 years
                as required by Nigerian law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remember your login and preferences</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized experiences</li>
                <li>Improve security and prevent fraud</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You can control cookie settings through your browser, but
                disabling cookies may affect platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Third-Party Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these external sites. We encourage you to review their privacy
                policies before providing any information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform is not intended for individuals under 18 years of
                age. We do not knowingly collect personal information from
                children. Vendors must be at least 18 years old or represent a
                registered business entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Compliance with Nigerian Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We comply with the Nigeria Data Protection Regulation (NDPR) and
                other applicable Nigerian laws. We are committed to protecting
                your data rights under Nigerian law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of material changes via email or platform
                notification. The <q>Last Updated</q> date at the top indicates
                when the policy was last revised. Continued use of the platform
                after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your data may be transferred to and processed in countries
                outside Nigeria where our service providers operate. We ensure
                appropriate safeguards are in place to protect your data in
                accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal data, please contact us:
              </p>
              <div className="text-gray-700 space-y-1">
                <p>
                  <strong>Email:</strong> doorrite.info@gmail.com
                </p>
                <p>
                  <strong>Data Protection Officer:</strong>{" "}
                  doorrite.info@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> +234 903 233 2821
                </p>
                <p>
                  <strong>Address:</strong> [Your Business Address], Nigeria
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By using our platform, you acknowledge that you have read and
                understood this Privacy Policy and consent to the collection,
                use, and sharing of your information as described herein.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            href="/terms"
            className="text-green-600 hover:text-green-700 transition-colors font-medium"
          >
            View Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
