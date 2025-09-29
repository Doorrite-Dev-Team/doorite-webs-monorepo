"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="bg-white px-6 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">
      {/* Illustration */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/assets/images/heroImage.png" // replace with your image
          alt="Delivery Illustration"
          width={400}
          height={400}
          className="w-full max-w-sm md:max-w-md"
        />
      </div>

      {/* Text */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
          Delivering Happiness, One Door at a Time
        </h1>
        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-xl">
          Doorrite connects customers with their favorite local businesses,
          offering a seamless delivery experience for food, groceries, and more.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800">
            Explore Platform
          </button>
          <button
            onClick={() => router.push("/continue")}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
