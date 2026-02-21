import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Use an icon for the action
import { ServicesInfo } from "@/libs/contant";

export default function ContinuePage() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 px-6 py-10 sm:px-8">
      {/* Header */}
      <div className="mx-auto max-w-md space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Choose your role
        </h1>
        <p className="text-sm text-muted-foreground">
          Select how you would like to proceed with the app.
        </p>
      </div>

      {/* Cards Container */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        {ServicesInfo.map((info) => (
          <Link
            href={info.url}
            key={info.name}
            className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
          >
            {/* Left Side: Text Content */}
            <div className="flex flex-1 flex-col gap-1 pr-4">
              <h2 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                {info.name}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {info.description}
              </p>

              {/* "Fake" Button text for affordance */}
              <div className="mt-3 flex items-center text-xs font-semibold text-primary">
                Select Role{" "}
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Right Side: Visual */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={info.imgSrc}
                alt=""
                fill
                className="object-cover p-2" // Adjust 'p-2' depending on if it's an icon or full photo
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
