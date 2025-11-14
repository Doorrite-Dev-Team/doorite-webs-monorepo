"use client";

import { FC } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";

const Dashboard: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      {/* <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Hi, Mama Put</h2>
          <div className="flex items-center mt-2 p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 w-fit">
            <Bell className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-gray-700">You have a new order</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Orders */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today&apos;s Orders
              </p>
              <h3 className="text-2xl font-bold mt-2">12</h3>
            </div>
            <Image
              src="/assets/images/order.png"
              alt="orders"
              width={120}
              height={80}
              className="mt-4 rounded-lg"
            />
          </div>

          {/* Earnings */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Earnings</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">$150</h3>
            </div>
            <Image
              src="/assets/images/earning.png"
              alt="earnings"
              width={120}
              height={80}
              className="mt-4 rounded-lg"
            />
          </div>

          {/* Items Available */}
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Items Available
              </p>
              <h3 className="text-2xl font-bold mt-2">20</h3>
            </div>
            <Image
              src="/assets/images/items.png"
              alt="items"
              width={120}
              height={80}
              className="mt-4 rounded-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Orders
          </button>
          <button className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
            Menu
          </button>
          <button className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
            Earnings
          </button>
          <button className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition">
            Reviews
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
