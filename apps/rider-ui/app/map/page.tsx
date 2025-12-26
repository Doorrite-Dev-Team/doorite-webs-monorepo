"use client";
import Map from "@/components/map/Map";
import MapLayoutClient from "@/components/map/MapLayoutClient";

 // optional if this whole page should be client-side
export default function MapPage() {
  return (
    <MapLayoutClient>
      <Map />
    </MapLayoutClient>
  );
}
