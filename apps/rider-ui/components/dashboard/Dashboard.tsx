"use client";

import { FC } from "react";
import Image from "next/image";

const Dashboard: FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FCF9] flex flex-col">
      <main className="flex-1 p-4 md:p-8">
        {/* Greeting */}
        <h2 className="text-xl md:text-2xl font-bold mb-6">Hi, Carter</h2>

        {/* Cards */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          {/* Active Deliveries */}
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div>
              <p className="text-green-600 font-medium">Active Deliveries</p>
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-gray-500 text-sm">No active deliveries</p>
            </div>
            <Image
              src="/assets/images/active.png"
              alt="active deliveries"
              width={100}
              height={80}
              className="rounded-lg"
            />
          </div>

          {/* Earnings Today */}
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div>
              <p className="text-green-600 font-medium">Earnings Today</p>
              <h3 className="text-2xl font-bold">$0.00</h3>
              <p className="text-gray-500 text-sm">No earnings yet</p>
            </div>
            <Image
              src="/assets/images/earning.png"
              alt="earnings today"
              width={100}
              height={80}
              className="rounded-lg"
            />
          </div>

          {/* Online Status */}
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div>
              <p className="text-green-600 font-medium">Online Status</p>
              <h3 className="text-lg font-semibold text-gray-800">Offline</h3>
              <p className="text-gray-500 text-sm">
                Go online to start receiving delivery requests
              </p>
            </div>
            <Image
              src="/assets/images/online.png"
              alt="online status"
              width={100}
              height={80}
              className="rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="p-4 md:px-8 md:pb-8">
        <button className="w-full py-4 rounded-full bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition">
          Go Online
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
