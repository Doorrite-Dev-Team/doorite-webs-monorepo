// app/terms/page.tsx
"use client";

import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Terms and Conditions
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
                Welcome to Doorrite. These Terms and Conditions govern your use
                of our platform as a vendor in Nigeria. By registering and using
                our services, you agree to comply with these terms. Please read
                them carefully.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Vendor Registration
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To become a vendor on Doorrite, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Be a registered business entity in Nigeria</li>
                <li>Provide accurate and complete business information</li>
                <li>Have all necessary licenses and permits to operate</li>
                <li>
                  Comply with Nigerian food safety and business regulations
                </li>
                <li>
                  Be at least 18 years old or represent a registered company
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Account Approval
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All vendor accounts require admin approval before activation. We
                reserve the right to reject any application without providing a
                reason. Approval typically takes 1-3 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Vendor Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                As a vendor, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate product descriptions and pricing</li>
                <li>Maintain product quality and food safety standards</li>
                <li>Process orders promptly and professionally</li>
                <li>Respond to customer inquiries within 24 hours</li>
                <li>Package items securely for delivery</li>
                <li>
                  Comply with all applicable Nigerian laws and regulations
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Product Listings
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for all content in your product listings.
                Products must be accurately described with current pricing. We
                reserve the right to remove listings that violate our policies
                or Nigerian laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Fees and Payments
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Doorrite charges commission fees on completed orders. Payment
                terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Commission fees will be deducted from each order</li>
                <li>Payments are processed to your registered account</li>
                <li>Settlement occurs within 7-14 business days</li>
                <li>You are responsible for applicable taxes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Order Fulfillment
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Vendors must fulfill orders within the timeframe specified on
                their profile. Failure to meet preparation times may result in
                penalties or account suspension. You must notify customers
                immediately if an item is unavailable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Cancellations and Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Vendors may cancel orders only for valid reasons such as product
                unavailability. Excessive cancellations may result in penalties.
                Refunds for vendor errors will be processed at the vendor&apos;s
                expense.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Quality Standards
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All food items must meet Nigerian food safety standards. You
                must maintain proper hygiene, storage, and handling procedures.
                Doorrite may conduct quality checks and suspend vendors not
                meeting standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Prohibited Activities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Vendors must not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Sell counterfeit, expired, or unsafe products</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Manipulate reviews or ratings</li>
                <li>Contact customers outside the platform</li>
                <li>Violate intellectual property rights</li>
                <li>Share account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Account Suspension and Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate your account for violating these
                terms, receiving excessive complaints, or engaging in prohibited
                activities. You may close your account at any time with 30 days
                notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of your business name, logo, and product
                images. By using our platform, you grant Doorrite a license to
                display your content for marketing and operational purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Doorrite is not liable for disputes between vendors and
                customers, lost revenue, or indirect damages. Our liability is
                limited to the fees paid to us in the past 12 months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of the Federal Republic of
                Nigeria. Disputes shall be resolved in Nigerian courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                15. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these terms at any time. We will notify you of
                material changes via email. Continued use of the platform after
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                16. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these terms, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: doorrite.info@gmail.com</p>
                <p>Phone: +234 903 233 2821</p>
                <p>Address: Ilorin, Nigeria</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By clicking <q>I Agree</q> during registration, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-green-600 hover:text-green-700 transition-colors font-medium"
          >
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
