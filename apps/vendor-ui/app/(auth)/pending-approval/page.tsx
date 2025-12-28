// app/pending-approval/page.tsx
"use client";

import Link from "next/link";
import { Clock, CheckCircle2, Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            href="/log-in"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Account Pending Approval
            </h1>
            <p className="text-lg text-gray-600">
              Your vendor account has been successfully created and is currently
              under review by our admin team.
            </p>
          </div>

          {/* Status Timeline */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Account Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-600">
                    Your vendor account has been registered
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Verified</p>
                  <p className="text-sm text-gray-600">
                    Your email address has been confirmed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Admin Review</p>
                  <p className="text-sm text-gray-600">
                    Awaiting approval from our admin team
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Activated</p>
                  <p className="text-sm text-gray-600">
                    You&apo;ll receive access to your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              What Happens Next?
            </h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Our admin team will review your business information and
                  documents
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  This process typically takes{" "}
                  <strong>1-3 business days</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  You&apos;ll receive an email notification once your account is
                  approved
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  After approval, you can log in and start using the platform
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions or need assistance, feel free to contact
              our support team:
            </p>
            <div className="space-y-3">
              <a
                href="mailto:doorrite.info@gmail.com"
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">
                    doorrite.info@gmail.com
                  </p>
                </div>
              </a>
              <a
                href="tel:+2349032332821"
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">+234 903 233 2821</p>
                </div>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href="/log-in">Try Login Again</Link>
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already approved?{" "}
            <Link
              href="/log-in"
              className="text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Log in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
