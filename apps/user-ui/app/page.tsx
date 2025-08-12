"use client";
import {
  doorriteImage,
  iconAccount,
  iconFacebook,
  iconInstagram,
  iconMotocycle,
  iconPackage,
  iconTwitter,
  iconWeb,
} from "@repo/ui/assets";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@repo/ui/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Bike, Globe, Package, ShoppingBag, Store, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { REVIEWS } from "../libs/contant";

const Home = () => {
  return (
    <>
      <header className="w-full">
        <nav className="flex items-center justify-between p-6">
          <Link href="/" className="">
            <Image src="/icon.jpg" alt="Logo" width={24} height={24} />
          </Link>
          <p className="font-bold text-xl">Doorrite</p>
          <Globe size={24} className="text-xl font-bold" />
        </nav>
      </header>
      <main className="my-3">
        <section className=" p-4 flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <Image
              src={doorriteImage}
              alt="Doorite Image"
              width={354}
              height={200}
            />
          </div>
          <h1 className="text-5xl font-extrabold text-balance-800">
            Delivering Happiness, One Door at a Time
          </h1>
          <p className="font-light text-balance-100">
            Doorrite connects customers with their favorite local businesses,
            offering a seamless delivery experience for food, groceries, and
            more.
          </p>
          <div className="flex items-center gap-5">
            <Button asChild>
              <Link href="/continue">Explore Platform</Link>
            </Button>
            <Button
              asChild
              className="bg-primary/15 text-black hover:bg-primary/25"
            >
              <Link href="/(auth)/signup">Get Started</Link>
            </Button>
          </div>
        </section>
        <section className="mt-5 flex flex-col items-center gap-10">
          <div className="p-4">
            <h2 className="font-bold text-2xl mb-5">Benefits for Everyone</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Customers",
                  description:
                    "Enjoy convenient access to a wide range of products and services, delivered right to your doorstep.",
                  icon: iconAccount,
                },
                {
                  name: "Vendors",
                  description:
                    "Expand your reach and grow your business with our reliable delivery network and marketing support.",
                  icon: iconPackage,
                },
                {
                  name: "riders",
                  description:
                    "Earn flexible income on your own schedule, delivering orders and contributing to your community.",
                  icon: iconMotocycle,
                },
                {
                  name: "Society",
                  description:
                    "We're committed to sustainability and social responsibility, creating positive impact through our operations.",
                  icon: iconWeb,
                },
              ].map((benefit) => (
                <div
                  key={benefit.name}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-800 text-white"
                >
                  {benefit.name === "Vendors" ? (
                    <Store size={24} className="mb-2" />
                  ) : benefit.name === "Customers" ? (
                    <User size={24} className="mb-2" />
                  ) : (
                    <Image
                      src={benefit.icon}
                      alt={`${benefit.name} Icon`}
                      width={24}
                      height={24}
                      className="mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-xl">{benefit.name}</h3>
                  <p className="text-sm text-gray-200">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full p-4">
            <h2 className="font-bold text-2xl mb-5">Benefits for Everyone</h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Orders Delivered",
                  count: "10M+",
                },
                {
                  name: "Active Partners",
                  count: "5K+",
                },
                {
                  name: "Rider Network",
                  count: "20K+",
                },
              ].map((benefit, i) => (
                <div
                  key={benefit.name}
                  className={`p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-secondary ${i === 2 && "col-span-2 "}`}
                >
                  <h3 className="font-semibold text-lg">{benefit.name}</h3>
                  <p className="text-2xl font-bold">{benefit.count}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <h2 className="font-bold text-2xl mb-5">How it works</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Browse & Order",
                  description:
                    "Customers explore local businesses and place orders through our app or website.",
                  icon: ShoppingBag,
                },
                {
                  name: "Prepare, Pack & Dispatch",
                  description:
                    "Vendors receive orders, prepare items, pack and dispatch them with our delivery partners.",
                  icon: Package,
                },
                {
                  name: "Deliver & Enjoy",
                  description:
                    "Customers track their orders in real-time and receive their items with a smile.",

                  icon: Bike,
                },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={step.name}
                    className={`bg-white border border-gray-200 hover:border-primary transition-colors ${
                      index === 2 ? "col-span-2" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                          {index + 1}
                        </div>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="mt-3">{step.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        <section className="mt-10 p-4">
          <h2 className="font-bold text-2xl mb-5">What People Are Saying</h2>
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              {REVIEWS.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <CardContent className="flex flex-col flex-1 p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-white">
                            {review.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="ml-3 font-semibold">
                          {review.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex-1">
                        {review.review}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>
      <footer className="w-full p-6 bg-gray-800 text-white text-center">
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: "About Us", href: "/about" },
              { name: "Careers", href: "/careers" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm p-2 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-4 mb-4">
            <Link
              href="/Contact"
              className="text-sm p-2 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="https://twitter.com/doorrite"
                target="_blank"
                className="text-sm hover:text-primary transition-colors"
              >
                <Image
                  src={iconTwitter}
                  alt="Twitter Icon"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://facebook.com/doorrite"
                target="_blank"
                className="text-sm hover:text-primary transition-colors"
              >
                <Image
                  src={iconFacebook}
                  alt="Facebook Icon"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://instagram.com/doorrite"
                target="_blank"
                className="text-sm hover:text-primary transition-colors"
              >
                <Image
                  src={iconInstagram}
                  alt="Instagram Icon"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} Doorrite. All rights reserved.
        </p>
        <p className="text-xs mt-2">Made with ❤️ by the Doorrite Team</p>
      </footer>
    </>
  );
};

export default Home;
