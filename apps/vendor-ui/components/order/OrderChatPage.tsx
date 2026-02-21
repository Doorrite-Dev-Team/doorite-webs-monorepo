"use client";

import Image from "next/image";
import { ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderChatPage() {
  const router = useRouter();

  const messages = [
    {
      id: 1,
      sender: "rider",
      name: "Ethan Carter",
      time: "10:05 AM",
      text: "I’m on my way to pick up the order.",
    },
    {
      id: 2,
      sender: "you",
      time: "10:10 AM",
      text: "Great, the order is almost ready.",
    },
    {
      id: 3,
      sender: "rider",
      name: "Ethan Carter",
      time: "10:30 AM",
      text: "I've picked up the order and I'm heading to the delivery address.",
    },
    {
      id: 4,
      sender: "you",
      time: "10:45 AM",
      text: "Please let us know if you encounter any issues.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 border-b">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">Ethan Carter – Rider #12345</p>
          <p className="text-green-700 text-sm">Order #12345</p>
        </div>

        <button>
          <Phone className="text-green-700 w-5 h-5" />
        </button>
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id}>
            {/* Rider Name */}
            {msg.sender === "rider" && (
              <p className="text-sm text-gray-700 font-semibold mb-1">{msg.name}</p>
            )}

            {/* Chat Bubble */}
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.sender === "you"
                  ? "bg-green-600 text-white ml-auto"
                  : "bg-green-100 text-gray-900"
              }`}
            >
              {msg.text}
            </div>

            {/* Timestamp */}
            <p
              className={`text-xs text-gray-500 mt-1 ${
                msg.sender === "you" ? "text-right" : ""
              }`}
            >
              {msg.time}
            </p>
          </div>
        ))}
      </div>

      {/* MESSAGE INPUT */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-green-100 p-3 rounded-xl">
          <input
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-gray-800"
          />
          <button className="px-4 py-2 bg-green-700 text-white rounded-xl">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
