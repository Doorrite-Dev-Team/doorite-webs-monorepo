"use client";

import { FC, useState } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
// import apiClient from "@/libs/api/client";
import { useRouter } from "next/navigation";
import CreateMenuItemForm from "../menu/CreateMenuItemForm";
import { useAtom } from "jotai";
import { vendorAtom } from "@/store/vendorAtom";

const Dashboard: FC = () => {
  const router = useRouter();
  // const [vendorName, setVendorName] = useState<string>("Loading...");
  const [vendor] = useAtom(vendorAtom);
  // const isVendorLog
  // const [loading, setLoading] = useState<boolean>(true);

  const [showForm, setShowForm] = useState(false);

  // useEffect(() => {
  //   const fetchVendor = async () => {
  //     try {

  //       const res = await apiClient.get(`vendors/${vendorId}`);
  //       const name =
  //         res.data?.data?.businessName ||
  //         vendor?.businessName ||
  //         vendor?.name ||
  //         "Guest Vendor";

  //       setVendorName(name);
  //     } catch (err) {
  //       console.log(err);
  //       setVendorName("Guest Vendor");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVendor();
  // }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F6] flex justify-center px-6 py-10">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hi, {vendor?.businessName || "Guest Vendor"}
          </h1>

          <div className="flex items-center gap-2 bg-white px-4 py-2 shadow-sm rounded-xl cursor-pointer hover:bg-gray-50">
            <Bell className="w-5 h-5 text-green-700" />
            <span className="text-gray-700 text-sm">You have a new order</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium text-sm">
                Today&apos;s Orders
              </p>
              <p className="text-green-700 font-bold text-xl mt-1">12</p>
            </div>

            <Image
              src="/assets/images/order.png"
              alt="orders"
              width={95}
              height={95}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium text-sm">
                Today&apos;s Earnings
              </p>
              <p className="text-green-700 font-bold text-xl mt-1">$150</p>
            </div>

            <Image
              src="/assets/images/earning.png"
              alt="earnings"
              width={95}
              height={95}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium text-sm">
                Items Available
              </p>
              <p className="text-green-700 font-bold text-xl mt-1">20</p>
            </div>

            <Image
              src="/assets/images/items.png"
              alt="items"
              width={95}
              height={95}
              className="rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Active Orders */}
        <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">
          Active Orders
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Order 1 */}
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <Image
              src="/assets/images/orderimg1.png"
              alt="img"
              width={500}
              height={300}
              className="rounded-xl w-full h-36 object-cover"
            />
            <p className="mt-3 text-gray-900 font-medium">Customer: Sarah</p>
            <p className="text-gray-500 text-sm">Order ID: #12345</p>
          </div>

          {/* Order 2 */}
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <Image
              src="/assets/images/orderimg2.png"
              alt="img"
              width={500}
              height={300}
              className="rounded-xl w-full h-36 object-cover"
            />
            <p className="mt-3 text-gray-900 font-medium">Customer: David</p>
            <p className="text-gray-500 text-sm">Order ID: #67890</p>
          </div>

          {/* Order 3 */}
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <Image
              src="/assets/images/orderimg2.png"
              alt="img"
              width={500}
              height={300}
              className="rounded-xl w-full h-36 object-cover"
            />
            <p className="mt-3 text-gray-900 font-medium">Customer: David</p>
            <p className="text-gray-500 text-sm">Order ID: #67890</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-10 mb-24 w-full max-w-md mx-auto">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition"
          >
            Create New Menu Item
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            View All Orders
          </button>
        </div>
      </div>
      {showForm && <CreateMenuItemForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Dashboard;
