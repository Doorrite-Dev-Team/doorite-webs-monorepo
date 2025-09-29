"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import { doorriteImage } from "@repo/ui/assets";

export default function Hero() {
  return (
    <section className="bg-white px-6 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">
      {/* Illustration */}
      <div className="flex-1 flex justify-center">
        <Image
          src={doorriteImage}
          alt="Doorrite Image"
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
            <Link href="/continue">Explore Platform</Link>
          </button>
          <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            <Link href="/sign-up">Get Started</Link>
          </button>
        </div>
      </div>
    </section>
  );
}
