"use client";

import { useState } from "react";
import {
  Bell,
  Globe,
  Palette,
  User,
  Lock,
  HelpCircle,
  CreditCard,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import AccountModal from "./AccountModal"; //

export default function Account() {
  const [theme] = useState("Light");
  const [language] = useState("English");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-8">
        <Image
          src="/assets/images/profile.png"
          alt="Profile"
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0"
        />

        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-gray-800">Sophia Chen</h2>
          <p className="text-gray-500">sophia.chen@email.com</p>
          <p className="text-green-600 font-medium">The Daily Grind</p>
        </div>
      </div>

      {/* Grid for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Options */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Options
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-gray-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-800">
                    Saved Payout Methods
                  </p>
                  <p className="text-sm text-green-600">Visa •••• 4567</p>
                </div>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>

            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-3">
                <PlusCircle className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Add Payout Method</p>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            App Settings
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-3">
                <Bell className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Notifications</p>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>

            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-3">
                <Globe className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Language</p>
              </div>
              <p className="text-sm text-gray-500">{language}</p>
            </div>

            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-3">
                <Palette className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Theme</p>
              </div>
              <p className="text-sm text-gray-500">{theme}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Settings
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex justify-between items-center cursor-pointer bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <User className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">
                  Update Personal Information
                </p>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>

            <div className="flex justify-between items-center cursor-pointer bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Lock className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Change Password</p>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>

            <div className="flex justify-between items-center cursor-pointer bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <HelpCircle className="text-gray-500 w-5 h-5" />
                <p className="font-medium text-gray-800">Contact Support</p>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>
      </div>
      <AccountModal show={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
