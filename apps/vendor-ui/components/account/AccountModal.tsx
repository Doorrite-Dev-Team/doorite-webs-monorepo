"use client";

import { Back } from "@/public/assets/icons";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useState } from "react";

interface AccountModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AccountModal({ show, onClose }: AccountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    delivery_time: "",
    contact_info: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 🔗 integrate API call here
    onClose();
  };

  return (
    <Transition show={show}>
      <Dialog className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        {/* Panel wrapper */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <TransitionChild
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="relative w-full max-w-md h-full bg-[#F7FAF7] shadow-xl overflow-y-scroll hide-scrollbar rounded-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={onClose}>
                      <Back className="w-6 h-6 text-gray-700" />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-1">
                      Profile
                    </h2>
                    <div className="w-6" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-green-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-green-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    {/* Delivery Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Time
                      </label>
                      <input
                        type="text"
                        name="delivery_time"
                        value={formData.delivery_time}
                        onChange={handleChange}
                        className="w-full border border-green-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Info
                      </label>
                      <input
                        type="text"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        className="w-full border border-green-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    {/* Support text */}
                    <p className="text-sm text-green-600">
                      Need help? Contact support
                    </p>

                    {/* Save button */}
                    <button
                      type="submit"
                      className="w-full bg-green-700 text-white py-3 rounded-full font-medium"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
