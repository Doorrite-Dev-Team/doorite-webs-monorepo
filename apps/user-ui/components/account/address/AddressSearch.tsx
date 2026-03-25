"use client";

import { useState, useCallback } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";

export interface GeocodingResult {
  id: string;
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface AddressSearchProps {
  value?: string;
  onChange: (
    address: string,
    coordinates?: { lat: number; long: number },
  ) => void;
  placeholder?: string;
  fallbackToManual?: () => void;
}

export default function AddressSearch({
  value,
  onChange,
  placeholder = "Search for your address...",
  fallbackToManual,
}: AddressSearchProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GeocodingResult | null>(
    null,
  );

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  const searchAddress = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !apiKey) return;

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?country=ng&limit=5&autocomplete=true&fuzzyMatch=true&key=${apiKey}`,
        );

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const formattedResults: GeocodingResult[] = data.features.map(
            (feature: any) => ({
              id: feature.id,
              name: feature.place_name,
              display_name:
                feature.properties?.display_name || feature.place_name,
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0],
              address: feature.properties?.address,
            }),
          );
          setResults(formattedResults);
          setShowResults(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        toast.error("Failed to search address. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [apiKey],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedResult(null);

    if (value.length >= 3) {
      const debounceTimer = setTimeout(() => {
        searchAddress(value);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectResult = (result: GeocodingResult) => {
    setSelectedResult(result);
    setQuery(result.display_name);
    setShowResults(false);

    onChange(result.display_name, { lat: result.lat, long: result.lon });
    toast.success("Address found!");
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode
          fetch(
            `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?limit=1&key=${apiKey}`,
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const result: GeocodingResult = {
                  id: feature.id,
                  name: feature.place_name,
                  display_name:
                    feature.properties?.display_name || feature.place_name,
                  lat: latitude,
                  lon: longitude,
                };
                setQuery(result.display_name);
                onChange(result.display_name, {
                  lat: latitude,
                  long: longitude,
                });
                toast.success("Location detected!");
              }
            })
            .catch(() => {
              toast.error("Could not get address from location");
            });
        },
        () => {
          toast.error("Could not get your location. Please check permissions.");
        },
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedResult(null);
    onChange("");
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
          {query && !isSearching && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              onClick={() => handleSelectResult(result)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-gray-900 line-clamp-2">
                    {result.name}
                  </p>
                  {result.address?.city && (
                    <p className="text-xs text-gray-500">
                      {[
                        result.address.city,
                        result.address.state,
                        result.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {query.length >= 3 &&
        !isSearching &&
        results.length === 0 &&
        showResults && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center mb-3">
              No addresses found for &ldquo;{query}&rdquo;
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleUseCurrentLocation}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
              {fallbackToManual && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={fallbackToManual}
                >
                  Enter Manually
                </Button>
              )}
            </div>
          </div>
        )}

      {/* Selected result indicator */}
      {selectedResult && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            {selectedResult.address?.city && `${selectedResult.address.city}, `}
            {selectedResult.address?.state}
          </span>
        </div>
      )}
    </div>
  );
}
