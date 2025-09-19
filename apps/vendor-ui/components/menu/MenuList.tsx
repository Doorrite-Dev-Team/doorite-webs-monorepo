"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

const items: MenuItem[] = [
  {
    id: 1,
    name: "Cheeseburger",
    description: "Classic burger with cheese",
    image: "/assets/images/menu1.png",
  },
  {
    id: 2,
    name: "Chicken Sandwich",
    description: "Crispy chicken sandwich",
    image: "/assets/images/menu2.png",
  },
  {
    id: 3,
    name: "French Fries",
    description: "Fries with ketchup",
    image: "/assets/images/menu3.png",
  },
  {
    id: 4,
    name: "Milkshake",
    description: "Vanilla milkshake",
    image: "/assets/images/menu4.png",
  },
];

export default function MenuList() {
  const [toggled, setToggled] = useState<Record<number, boolean>>({});

  const handleToggle = (id: number) => {
    setToggled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 md:p-8">
      {/* Page Title */}
      <h2 className="text-lg md:text-2xl font-semibold mb-6">Menu</h2>

      {/* Menu Items List */}
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Left Section */}
            <div className="flex items-start md:items-center space-x-4 flex-1">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {item.name}
                </h3>
                <p className="text-sm text-green-600">{item.description}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                onClick={() => handleToggle(item.id)}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition ${
                  toggled[item.id] ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                    toggled[item.id] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition">
        <Plus className="text-white w-6 h-6" />
      </button>
    </div>
  );
}
