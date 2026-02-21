"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MapIcon,
  TruckIcon,
  WalletIcon,
  UserCircle2,
} from "lucide-react";

const navItems = [
  { name: "Home", icon: HomeIcon, href: "/dashboard" },
  { name: "Deliveries", icon: TruckIcon, href: "/deliveries" },
  { name: "Map", icon: MapIcon, href: "/map" },
  { name: "Wallet", icon: WalletIcon, href: "/earnings" },
  { name: "Account", icon: UserCircle2, href: "/account" },
];

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom navigation */}
      <footer className="block md:hidden bg-white relative bottom-0 border-t p-3.5">
        <ul className="flex items-center justify-between mx-auto list-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2  rounded-lg transition
                    ${
                      isActive
                        ? "text-green-700 font-bold"
                        : "text-green-600 hover:text-green-800"
                    }`}
                >
                  <div className={`h-8 w-16 flex items-center justify-center
                  ${
                  isActive 
                  ? "bg-green-100 rounded-2xl" 
                  : ""
                  }`}>
                    <item.icon className={`w-5 h-5`} />
                  </div>
                  <span className="text-[13px]">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </footer>
    </>
  );
}

// import { usePathname } from "next/navigation";
// import { Home, Truck, Map, DollarSign, User, LogOut } from "lucide-react";
// import Link from "next/link";
// import { Logo } from "@/public/assets/icons";

// const navItems = [
//   { name: "Home", icon: Home, href: "/dashboard" },
//   { name: "Deliveries", icon: Truck, href: "/deliveries" },
//   { name: "Map", icon: Map, href: "/map" },
//   { name: "Earnings", icon: DollarSign, href: "/earnings" },
//   { name: "Account", icon: User, href: "/account" },
// ];

// export default function Sidebar({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: (v: boolean) => void;
// }) {
//   const pathname = usePathname();

//   return (
//     <div className="hidden lg:block">
//       {/* 🔹 Mobile Backdrop */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-[#0000007a] bg-opacity-40 z-30 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
//         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//         onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//       >
//         {/* Logo */}
//         <div className="p-4 border-b font-bold text-xl text-green-700 flex items-center space-x-2">
//           <Logo className="w-6 h-6" />
//           <span>Doorrite</span>
//         </div>

//         {/* Navigation */}
//         <ul className="flex flex-col p-4 space-y-2">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <li key={item.name}>
//                 <Link
//                   href={item.href}
//                   className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition
//                     ${
//                       isActive
//                         ? "bg-green-100 text-green-700"
//                         : "text-green-600 hover:text-green-800"
//                     }`}
//                   onClick={() => setOpen(false)}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>

//         {/* Logout */}
//         <div className="absolute bottom-4 left-0 w-full px-4">
//           <button className="flex items-center space-x-3 text-red-600 hover:text-red-800">
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </div>
//   );
// }
