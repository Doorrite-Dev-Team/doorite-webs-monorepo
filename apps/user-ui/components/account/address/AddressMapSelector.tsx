"use client";

import { useState, useEffect, useRef } from "react";
import { Map, Marker, NavigationControl } from "@maptiler/sdk";
import { Search, MapPin, X, Loader2, Navigation, Check } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";

// import "maptiler-sdk/dist/maptiler-sdk.css";

interface AddressMapSelectorProps {
  onSelect: (
    address: string,
    coordinates: { lat: number; long: number },
    state?: string,
    country?: string,
  ) => void;
  onClose: () => void;
  initialCoordinates?: { lat: number; long: number } | null;
}

const DEFAULT_CENTER: [number, number] = [3.3792, 6.5244]; // Lagos
const DEFAULT_ZOOM = 13;

export default function AddressMapSelector({
  onSelect,
  onClose,
  initialCoordinates,
}: AddressMapSelectorProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    long: number;
  } | null>(initialCoordinates || null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  // Initialize map - run once on mount
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const center: [number, number] = coordinates
      ? [coordinates.long, coordinates.lat]
      : DEFAULT_CENTER;

    const map = new Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json",
      center,
      zoom: DEFAULT_ZOOM,
      apiKey: apiKey || "",
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      setIsMapReady(true);
    });

    // Click to set marker
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates({ lat, long: lng });
      reverseGeocode(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    if (coordinates) {
      if (markerRef.current) {
        markerRef.current.setLngLat([coordinates.long, coordinates.lat]);
      } else {
        const marker = new Marker({ color: "#ef4444" })
          .setLngLat([coordinates.long, coordinates.lat])
          .addTo(mapRef.current);
        markerRef.current = marker;
      }

      mapRef.current.flyTo({
        center: [coordinates.long, coordinates.lat],
        zoom: 15,
        duration: 500,
      });
    }
  }, [coordinates, isMapReady]);

  // Auto-detect location on mount - run once on mount
  useEffect(() => {
    if (!coordinates) {
      detectUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, long: longitude });
        reverseGeocode(latitude, longitude);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Unable to determine location");
        } else {
          setLocationError("Location request timed out");
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lon},${lat}.json?limit=1&key=${apiKey}`,
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        setSelectedAddress(feature.place_name);
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  const searchAddress = async (searchQuery: string) => {
    if (!searchQuery.trim() || !apiKey) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?country=ng&limit=5&autocomplete=true&fuzzyMatch=true&key=${apiKey}`,
      );
      const data = await response.json();

      if (data.features) {
        setResults(data.features);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      const debounce = setTimeout(() => searchAddress(value), 300);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const [lon, lat] = result.geometry.coordinates;
    setCoordinates({ lat, long: lon });
    setSelectedAddress(result.place_name || result.properties?.display_name);
    setQuery("");
    setShowResults(false);
    setResults([]);
  };

  const handleConfirm = () => {
    if (!coordinates) {
      toast.error("Please select a location on the map");
      return;
    }

    // Parse address to get state and country
    const parts = selectedAddress.split(",").map((p) => p.trim());
    let state = "";
    let country = "Nigeria";

    // Try to extract state (usually second to last in Nigerian addresses)
    if (parts.length >= 2) {
      const possibleState = parts[parts.length - 2]?.trim();
      if (possibleState && possibleState !== "Nigeria") {
        state = possibleState;
      }
    }

    // Check last part for country
    const lastPart = parts[parts.length - 1]?.trim();
    if (lastPart && lastPart !== "Nigeria") {
      country = lastPart;
    }

    onSelect(selectedAddress, coordinates, state, country);
  };

  const handleUseCurrentLocation = () => {
    detectUserLocation();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h3 className="font-semibold text-lg">Select Location</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white border-b relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={handleSearchChange}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search for a place..."
            className="pl-9 pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Search Results */}
        {showResults && results.length > 0 && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {results.map((result, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                onClick={() => handleSelectResult(result)}
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {result.place_name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Status Bar */}
      <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLoadingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">
                Detecting location...
              </span>
            </>
          ) : coordinates ? (
            <>
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Location set</span>
            </>
          ) : locationError ? (
            <>
              <MapPin className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">{locationError}</span>
            </>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Navigation className="w-4 h-4 mr-1" />
          {isLoadingLocation ? "Detecting..." : "Use My Location"}
        </Button>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="flex-1 w-full min-h-[300px]" />

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="p-3 bg-green-50 border-t">
          <p className="text-sm font-medium text-green-900 mb-2">
            Selected Address:
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {selectedAddress}
          </p>
        </div>
      )}

      {/* Instructions */}
      {!selectedAddress && (
        <div className="p-3 bg-blue-50 border-t">
          <p className="text-sm text-blue-800">
            Tap on the map to set your location, or use the search bar above
          </p>
        </div>
      )}

      {/* Confirm Button */}
      <div className="p-4 bg-white border-t">
        <Button
          className="w-full"
          size="lg"
          onClick={handleConfirm}
          disabled={!coordinates || !selectedAddress}
        >
          <Check className="w-5 h-5 mr-2" />
          Confirm Location
        </Button>
      </div>
    </div>
  );
}
