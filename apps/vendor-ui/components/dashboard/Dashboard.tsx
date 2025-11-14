"use client";

import { FC } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import Axios from "@/libs/Axios";

const Dashboard: FC = () => {
  const [vendorName, setVendorName] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const stored = localStorage.getItem("user");
        console.log("🧩 LocalStorage user:", stored);

        if (!stored) {
          console.warn("⚠️ No user found in localStorage");
          setVendorName("Guest Vendor");
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(stored);
        console.log("🔍 Parsed user object:", parsed);

        // ✅ Correctly get vendor from localStorage shape
        const vendor =
          parsed?.vendor ||
          parsed?.user ||
          parsed?.data?.vendor ||
          parsed?.data?.user ||
          parsed?.data ||
          parsed;

        const vendorId = vendor?.id || vendor?._id;
        console.log("🆔 Extracted vendorId:", vendorId);

        if (!vendorId) {
          console.warn("⚠️ No vendor ID found in stored data");
          setVendorName("Guest Vendor");
          setLoading(false);
          return;
        }

        console.log("🌐 Fetching vendor details from:", `vendors/${vendorId}`);
        const res = await Axios.get(`vendors/${vendorId}`);

        console.log("✅ Vendor response:", res.data);

        const name =
          res.data?.data?.businessName ??
          vendor?.businessName ??
          vendor?.name ??
          "Guest Vendor";

        setVendorName(name);
      } catch (err: any) {
        console.error("❌ Failed to fetch vendor:", err.message || err);
        setVendorName("Guest Vendor");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            Hi, {loading ? "Loading..." : vendorName}
          </h2>

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
