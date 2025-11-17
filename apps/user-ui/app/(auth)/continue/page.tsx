"use client";
import Image from "next/image";
import Link from "next/link";
import { ServicesInfo } from "@/libs/contant";

export default function ContinuePage() {
  return (
    <div className="p-6">
      <main className="space-y-8">
        <p className="text-center pb-4 font-semibold">
          Choose your role to proceed with the app.
        </p>
        <div className="flex flex-col gap-2">
          {ServicesInfo.map((info) => (
            <Link
              href={info.url}
              key={info.name}
              className="flex justify-between items-center border-b-2 py-5 border-primary"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-semibold text-base">{info.name}</h2>
                  <p className="text-primary">{info.description}</p>
                </div>
                <div className="p-2 px-4 cursor-pointer rounded-[7px] bg-[#e5f5e5] w-fit">
                  Select →
                </div>
              </div>
              <div>
                <Image src={info.imgSrc} alt="" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
