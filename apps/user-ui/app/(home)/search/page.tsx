"use client";

import { iconSearch } from "@repo/ui/assets";
import { Input } from "@repo/ui/components/input";
import { CircleX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { vendor, VENDORS } from "../../../libs/contant";

const SearchPage = (): React.ReactNode => {
  // Live search state
  const [search, setSearch] = useState("");
  // Debounced value (500ms)
  const [debouncedSearch] = useDebounceValue(search, 500);

  const filteredItems = debouncedSearch
    ? VENDORS.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : VENDORS;

  return (
    <div className="flex h-full w-full items-center justify-center mt-4">
      <div className="w-full flex flex-col items-center gap-4">
        {/* Search bar */}
        <div className="w-full mx-4">
          <Input
            variant="ghost"
            size="lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <Image
                src={iconSearch}
                alt="Search Icon"
                width={20}
                height={20}
              />
            }
            rightIcon={
              search && (
                <CircleX
                  className="text-primary cursor-pointer"
                  size={25}
                  onClick={() => setSearch("")}
                />
              )
            }
            placeholder="Search for food or Vendor"
            className="text-primary text-lg placeholder:text-muted-foreground bg-primary/10 border border-primary/20 rounded-lg shadow-sm"
          />
        </div>

        {/* Results */}
        <div className="text-primary text-lg w-full px-4">
          {debouncedSearch && (
            <p className="mb-2">
              Showing search results for:{" "}
              <span className="font-semibold">{debouncedSearch}</span>
            </p>
          )}
          <div className="space-y-10">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <FoodOrVendorList key={item.id} {...item} />
              ))
            ) : (
              <span className="text-muted-foreground">No results found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const FoodOrVendorList = (Vendor: vendor) => (
  <Link href="/vendor" className="flex items-center justify-between p-4 border-b">
    <div className="flex flex-col max-w-[70%]">
      <p className="text-primary text-lg font-semibold">{Vendor.name}</p>
      <p className="text-muted-foreground text-sm">{Vendor.description}</p>
      <span className="mt-4 bg-primary/20 text-gray-800 rounded-lg py-2 text-center w-30">
        {Vendor.avrgPreparationTime}
      </span>
    </div>
    <Image
      src={Vendor.image}
      alt={Vendor.name}
      width={120}
      height={100}
      className="rounded-lg object-cover"
    />
  </Link>
);
