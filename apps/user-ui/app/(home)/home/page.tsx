"use client";
import { iconSearch } from "@repo/ui/assets";
import { Card } from "@repo/ui/components/card";
import { Carousel, CarouselContent, CarouselItem } from "@repo/ui/components/carousel";
import { Input } from "@repo/ui/components/input";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import Image from "next/image";
import { foodTags, VENDORS } from "../../../libs/contant";

const Home = () => {
  return (
    <div className="flex h-full w-full items-center justify-center mt-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex w-full mx-4 items-center gap-2 rounded-lg border bg-primary/10 p-2 shadow-sm">
          <Image src={iconSearch} alt="Search Icon" width={20} height={20} />
          <Input
            placeholder="Search for food or Vendor"
            className="flex-1 text-primary text-lg bg-transparent border-0 shadow-none appearance-none focus:appearance-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus-visible:ring-0 placeholder:text-muted-foreground "
          />
        </div>
        <ScrollArea className="w-full whitespace-nowrap my-2">
          <div className="flex items-center space-x-2 px-4 mb-2">
            {foodTags.map((tag, index) => (
              <Card
                key={index}
                className="h-12 px-4 flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium">{tag}</span>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="w-full my-4 space-y-4">
          <h2 className="width-full text-2xl font-bold text-primary mt-4">Popular Foods</h2>
          <VendorsCarousel />
        </div>
        <div className="w-full my-4 space-y-4">
          <h2 className="width-full text-2xl font-bold text-primary mt-4">All Vendors</h2>
          {
            VENDORS.map((vendor) => (
              <div key={vendor.id} className="flex items-center gap-4 p-4">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  width={80}
                  height={80}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                  <p className="text-sm text-primary/50">{vendor.avrgPreparationTime}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Home;

const VendorsCarousel = () =>  {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {VENDORS.map((vendor) => (
          <CarouselItem key={vendor.id} className="pl-2 basis-64">
            <Card className="w-full h-full bg-transparent flex flex-col items-center justify-center p-4">
              <Image
                src={vendor.image}
                alt={vendor.name}
                width={250}
                height={250}
                className="w-full h-50 object-cover rounded-lg mb-2"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {vendor.name}
              </h3>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}