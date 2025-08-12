"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { imageCustomer, imageRider, imageVendor } from "@repo/ui/assets";
import Image from "next/image";

export default function ContinuePage() {
  const router = useRouter();
  return (
    <div className="p-6">
        <div className="absolute">
          <button onClick={() => router.back()}> &larr; </button>
        </div>
        <main className="pb-8 text-center">
          <h1 className="text-xl font-bold">Continue as...</h1>
          <p>Choose your role to proceed with the app.</p>
        </main>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-semibold text-base">Vendor</h2>
              <p className="text-[#45A145]">Manage your store and orders.</p>
            </div>
            <Link href="/vendorApp" className="p-2 px-4 cursor-pointer rounded-[7px] bg-[#e5f5e5] w-fit">
              Select →
            </Link>
          </div>
          <div>
            <Image src={imageVendor} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-semibold text-base">Rider</h2>
              <p className="text-[#45A145]">Deliver order and earn.</p>
            </div>
            <Link href="/riderApp" className="p-2 px-4 cursor-pointer rounded-[7px] bg-[#e5f5e5] w-fit">
              Select →
            </Link>
          </div>
          <div>
            <Image src={imageRider} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-semibold text-base">Customer</h2>
              <p className="text-[#45A145]">Order food and groceries.</p>
            </div>
            <Link href="/customerApp" className="p-2 px-4 cursor-pointer rounded-[7px] bg-[#e5f5e5] w-fit">
              Select →
            </Link>
          </div>
          <div>
            <Image src={imageCustomer} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
