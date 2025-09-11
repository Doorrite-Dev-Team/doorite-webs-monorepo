import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import React from "react";

type Location = { name: string };

interface LocationSelectorProps {
  onCountryChange: (country: Location) => void;
  onStateChange: (state: Location) => void;
  countryValue?: string;
  stateValue?: string;
}

const COUNTRIES = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Turkey", label: "Turkey" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
];

const STATES_BY_COUNTRY: Record<string, { value: string; label: string }[]> = {
  Nigeria: [
    { value: "Lagos", label: "Lagos" },
    { value: "Oyo", label: "Oyo" },
    { value: "Abuja", label: "Abuja" },
    { value: "Kano", label: "Kano" },
  ],
  "United States": [
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
  ],
  "United Kingdom": [
    { value: "England", label: "England" },
    { value: "Scotland", label: "Scotland" },
    { value: "Wales", label: "Wales" },
    { value: "Northern Ireland", label: "Northern Ireland" },
  ],
  Canada: [
    { value: "Ontario", label: "Ontario" },
    { value: "Quebec", label: "Quebec" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Alberta", label: "Alberta" },
  ],
  Turkey: [
    { value: "Istanbul", label: "Istanbul" },
    { value: "Ankara", label: "Ankara" },
    { value: "Izmir", label: "Izmir" },
    { value: "Bursa", label: "Bursa" },
  ],
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onCountryChange,
  onStateChange,
  countryValue,
  stateValue,
}) => {
  const availableStates = countryValue
    ? STATES_BY_COUNTRY[countryValue] || []
    : [];

  return (
    <div className="space-y-3">
      <Select
        onValueChange={(value) => onCountryChange({ name: value })}
        value={countryValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {availableStates.length > 0 && (
        <Select
          onValueChange={(value) => onStateChange({ name: value })}
          value={stateValue}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select State/Province" />
          </SelectTrigger>
          <SelectContent>
            {availableStates.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
