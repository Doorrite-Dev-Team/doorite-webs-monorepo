"use client";
import RiderMap from "@/components/map/Map";
import MapLayoutClient from "@/components/map/MapLayoutClient";

export default function MapPage() {
  return (
    <MapLayoutClient>
      <RiderMap />
    </MapLayoutClient>
  );
}
