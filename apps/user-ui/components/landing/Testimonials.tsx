"use client";

import { REVIEWS } from "@/libs/contant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@repo/ui/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
} from "@repo/ui/components/card";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";

export default function Testimonials() {
  return (
    <section className="w-full px-6 md:px-16 py-16 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        What People Are Saying
      </h2>
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 4000 })]}
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
                    <span className="ml-3 font-semibold">{review.name}</span>
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
  );
}
