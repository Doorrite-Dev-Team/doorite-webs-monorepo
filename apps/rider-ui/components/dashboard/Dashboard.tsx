"use client";
import { FC } from "react";
// import Image from "next/image";
import { Trophy, Navigation2Icon, ShoppingBag, Check, Plus, WalletIcon } from "lucide-react";
import TaskCard from "@/app/components/taskcard";

const Dashboard: FC = () => {
  return (
    <div className="h-[-webkit-available] pb-24 bg-background-light dark:bg-background-dark text-[#111714] dark:text-white font-display overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            Hello, Samuel 👋
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center cursor-pointer gap-1 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200">
              <Trophy className="w-4 h-4" />
              Top Rider
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col gap-5 px-4 pt-4">
        {/* Online / Offline */}
        <div className="w-full">
          <label className="group relative flex items-center justify-between p-1 bg-white dark:bg-surface-dark rounded-full shadow-card border border-gray-100 dark:border-white/5 cursor-pointer select-none">
            <input className="peer sr-only" type="checkbox" defaultChecked />
            <div className="absolute inset-0 bg-primary opacity-0 peer-checked:opacity-10 rounded-full" />
            <span className="z-10 flex-1 text-center py-3 text-sm font-bold text-gray-500 dark:text-gray-400 peer-checked:text-primary">
              Offline
            </span>
            <span className="z-10 flex-1 text-center py-3 text-sm font-bold text-gray-500 dark:text-gray-400 peer-checked:text-white relative">
              Online
            </span>

            <div className="absolute right-1 top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full shadow-md transform scale-0 peer-checked:scale-100 transition-transform duration-300 ease-out" />
            <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-gray-100 dark:bg-white/10 rounded-full shadow-inner transform scale-100 peer-checked:scale-0 transition-transform duration-300" />
          </label>
        </div>

        {/* Map & Next Delivery */}
        <div className="relative w-full flex flex-col gap-4">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-soft group">
            <div
              className="absolute inset-0 bg-gray-200 dark:bg-gray-800 bg-cover bg-center"
              style={{ backgroundImage: "url('https://placehold.co/600x340')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg" />
              </div>
            </div>

            <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">You are online</span>
            </div>
          </div>

          <div className="relative -mt-12 mx-2">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    Next Delivery
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">Order #2931</h3>
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      PICKUP
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono">
                    15
                    <span className="text-sm text-gray-500 font-normal ml-1">
                      min
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-b border-gray-50 dark:border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                  <img
                    alt="McDonalds Logo"
                    className="w-full h-full object-cover rounded-lg"
                    src="/assets/images/vendor.png"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">McDonald's</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="truncate">
                      12 Adeola St, Victoria Island
                    </span>
                  </div>
                </div>
              </div>

              <button className="cursor-pointer w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                {/* <span className="material-symbols-outlined text-[20px]">navigation</span> */}
                <Navigation2Icon className="w-4 h-4" />
                Navigate to Pickup
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-card border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              {/* <span className="material-symbols-outlined text-[18px]">shopping_bag</span> */}
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold">2</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
              Active
            </span>
          </div>

          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-card border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-1">
              {/* <span className="material-symbols-outlined text-[18px]">
                payments
              </span> */}
              <WalletIcon className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold">₦12.5k</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
              Earned
            </span>
          </div>

          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-card border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-1">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center mb-1">
              <span className="w-4 h-4 bg-orange-600 rounded-[50%] material-symbols-outlined text-[18px]">
                
              </span>
            </div>
            <span className="text-lg font-extrabold">4.5h</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
              Online
            </span>
          </div>
        </div>

        {/* Current Tasks (collapsible cards) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold">Current Tasks</h2>
            <span className="text-xs font-medium text-primary cursor-pointer">
              View All
            </span>
          </div>

          <TaskCard
            title="Pickup Order #2931"
            subtitle="McDonald's • 2.1km away"
            status="In Progress"
            progress={66}
          />

          <TaskCard
            title="Deliver Order #2932"
            subtitle="To: Samuel O. • 5.4km"
            status="Pending"
            progress={0}
            disabled
          />
        </div>

        {/* Challenges & Bonuses */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Challenges & Bonuses</h2>
          <div className="bg-gradient-to-r from-[#112117] to-[#16a249] rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-[80px]">
                trophy
              </span>
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 p-1 rounded text-xs font-bold">
                  LUNCH RUSH
                </span>
              </div>
              <h3 className="font-bold text-lg leading-tight">
                Complete 2 more deliveries
              </h3>
              <p className="text-white/80 text-sm">
                Get <span className="font-bold">+₦500 bonus</span> instantly
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full w-3/5 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                </div>
                <span className="text-xs font-bold">3/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-xl shadow-card border border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Wallet Balance
            </span>
            <h2 className="text-2xl font-extrabold">₦45,200</h2>
          </div>
          <button className="bg-background-light dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#111714] dark:text-white px-5 py-2.5 rounded-full text-sm font-bold">
            Withdraw
          </button>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-card border border-gray-100 dark:border-white/5 divide-y divide-gray-50">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                {/* <span className="material-symbols-outlined text-[16px]">
                  check
                </span> */}
                <Check className="w-4 h-4"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Delivered Order #2930</p>
                <p className="text-xs text-gray-500">
                  Chicken Republic • ₦1,200
                </p>
              </div>
              <span className="text-xs text-gray-400">10m ago</span>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                {/* <span className="material-symbols-outlined text-[16px]">
                  add
                </span> */}
                <Plus className="w-4 h-4"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Bonus Received</p>
                <p className="text-xs text-gray-500">Morning streak complete</p>
              </div>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
          </div>
        </div>
      </main>

      {/* Floating action */}
      <button className="fixed cursor-pointer bottom-24 right-4 z-40 w-16 h-16 bg-primary text-white rounded-full shadow-[0_8px_30px_rgba(22,162,73,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
        {/* <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">
          add
        </span> */}
        <Plus className="w-8 h-8"/>
        <span className="absolute right-full mr-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
          Accept Order
        </span>
      </button>


      <div className="h-20" />
    </div>
    // );
    // };

    // export default RiderHomePage;
  );
};

export default Dashboard;


// import React from "react";
// import { HomeIcon, MapIcon, WalletIcon, UserCircle2 } from "lucide-react";

// export default function Bottombar() {
//   return (
//     <div>
//       {/* Bottom navigation */}
//       <nav className="fixed bg-white border-t  bottom-0 left-0 right-0 glass-nav z-50 pb-safe pt-2 px-6 h-[80px]">
//         <div className="flex items-center justify-between max-w-lg mx-auto h-full pb-2">
//           <button className="cursor-pointer flex flex-col items-center justify-center gap-1 text-primary w-12 group">
//             <div className="relative">
//               <HomeIcon className="w-4 h-4" />
//               <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
//             </div>
//             <span className="text-[10px] font-bold">Home</span>
//           </button>

//           <button className="cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 w-12">
//             <WalletIcon className="w-4 h-4" />
//             <span className="text-[10px] font-medium">Tasks</span>
//           </button>

//           <button className="cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 w-12">
//             <MapIcon className="w-4 h-4" />
//             <span className="text-[10px] font-medium">Map</span>
//           </button>

//           <button className="cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 w-12">
//             <WalletIcon className="w-4 h-4" />
//             <span className="text-[10px] font-medium">Wallet</span>
//           </button>

//           <button className="cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 w-12">
//             <UserCircle2 className="w-4 h-4" />
//             <span className="text-[10px] font-medium">Account</span>
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// }
