"use client";

import * as React from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import { Loader2, AlertCircle, Navigation, CheckCircle2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
// import { Input } from "@repo/ui/components/input";

interface GeoLocationRequesterProps {
  onAccept: (
    coords: { latitude: number; longitude: number },
    preview?: { display_name?: string; state?: string; country?: string },
  ) => void;
  onCancel: () => void;
}

interface ReverseGeoResult {
  display_name?: string;
  state?: string;
  country?: string;
}

export default function GeoLocationRequester({
  onAccept,
  onCancel,
}: GeoLocationRequesterProps) {
  const { error, loading, latitude, longitude } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });

  const [reverseLoading, setReverseLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<ReverseGeoResult | null>(null);
  // const [displayName, setDisplayName] = React.useState<string>("");
  const [reverseError, setReverseError] = React.useState<string | null>(null);

  // Reverse geocode when coordinates are available
  React.useEffect(() => {
    if (latitude == null || longitude == null) return;

    const fetchReverseGeocode = async () => {
      setReverseLoading(true);
      setReverseError(null);
      setPreview(null);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "food-delivery-app/1.0",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const address = data?.address || {};

        setPreview({
          display_name: data?.display_name,
          state: address.state || address.region || address.county || "",
          country: address.country || "",
        });
        // setDisplayName(data?.display_name);
      } catch (err) {
        console.warn("Reverse geocode error:", err);
        setReverseError(
          err instanceof Error
            ? err.message
            : "Failed to fetch address preview",
        );
      } finally {
        setReverseLoading(false);
      }
    };

    // Small delay to avoid rate limiting
    const timer = setTimeout(fetchReverseGeocode, 500);
    return () => clearTimeout(timer);
  }, [latitude, longitude]);

  const handleAccept = () => {
    if (latitude == null || longitude == null) {
      toast.error("Location not available. Please try again.");

      return;
    }

    onAccept({ latitude, longitude }, preview || undefined);
  };

  // const changeDisplayName = () => {
  //   setPreview((prev) => ({
  //     ...prev,
  //     display_name: displayName,
  //   }));
  // };

  // Permission error
  if (error) {
    return (
      <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-900">Location Access Denied</p>
            <p className="text-sm text-red-700 mt-1">
              {error instanceof GeolocationPositionError
                ? error.code === 1
                  ? "Please allow location access in your browser settings."
                  : error.code === 2
                    ? "Unable to determine your location. Please check your device settings."
                    : "Location request timed out. Please try again."
                : String(error)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Loading geolocation
  if (loading) {
    return (
      <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg space-y-3">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">Locating...</p>
            <p className="text-sm text-blue-700">
              Please allow location access when prompted
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Have coordinates
  if (latitude != null && longitude != null) {
    return (
      <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg space-y-3">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-green-900 mb-2">Location Found</p>

            {/* Coordinates */}
            <div className="text-sm space-y-1 mb-3">
              <p className="text-gray-700">
                <span className="font-medium">Coordinates:</span>
              </p>
              <p className="text-xs font-mono text-gray-600">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
              {/*<div className="w-full flex gap-2 items-center">
                <Input value={displayName} />
                <Button onClick={changeDisplayName}>OK</Button>
              </div>*/}
            </div>

            {/* Reverse geocode status */}
            {reverseLoading && (
              <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching address details...
              </div>
            )}

            {reverseError && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 mb-2">
                <p className="font-medium">Address preview unavailable</p>
                <p className="text-xs mt-1">
                  You can still use the coordinates. {reverseError}
                </p>
              </div>
            )}

            {preview?.display_name && (
              <div className="p-3 bg-white border border-green-200 rounded-lg mb-2">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">
                    Detected Address:
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-2 pl-6">
                  {preview.display_name}
                </p>
                {(preview.state || preview.country) && (
                  <p className="text-xs text-gray-600 pl-6">
                    {[preview.state, preview.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
            <p className="text-yellow-400 font-bold text-sm italic">
              Always Accept the Detected Address
            </p>
            <p className="text-red-500 font-bold text-sm italic">
              Please Note: The Detected Address may not be Accurate Hence,
              Kindly Change your Address after Acceptance If not Accurate.
            </p>

            {!reverseLoading && !preview?.display_name && !reverseError && (
              <p className="text-sm text-gray-700 mb-2">
                Location coordinates captured. You can manually enter the
                address details.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleAccept} className="flex-1 gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Use This Location
          </Button>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <p className="text-sm text-gray-600">Initializing location services...</p>
    </div>
  );
}
