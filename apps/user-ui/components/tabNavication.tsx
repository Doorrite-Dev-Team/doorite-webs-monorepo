"use client";

import { iconAccount, iconOrder, iconSearch } from "@repo/ui/assets";
import { cn } from "@repo/ui/lib/utils";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabNavication = () => {
    const pathname = usePathname();
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-around items-center z-50">
      {[
        {
          name: "Home",
          icon: <Home size={24} className="text-primary" />,
          href: "/home",
        },
        {
          name: "Search",
          icon: <Image src={iconSearch} alt="Profile" width={24} height={24} />,
          href: "/search",
        },
        {
          name: "Orders",
          icon: <Image src={iconOrder} alt="Profile" width={24} height={24} />,
          href: "/orders",
        },
        {
          name: "Account",
          icon: (
            <Image src={iconAccount} alt="Profile" width={24} height={24} />
          ),
          href: "/account",
        },
      ].map((item) => (
          <Link key={item.name} href={item.href} className={cn("flex flex-col items-center gap-2 w-full rounded-md p-2", {
            "text-primary": pathname === item.href,
            "text-gray-500": pathname !== item.href,
            "bg-transparent": pathname !== item.href,
            "bg-primary/30": pathname === item.href,
          }
            )}>
            {item.icon}
            <span className="text-xs">{item.name}</span>
          </Link>
      ))}
    </footer>
  );
};

export default TabNavication;
