export const vendorImage = (logoUrl?: string) => {
  const isValidImage =
    (typeof logoUrl === "string" &&
      (logoUrl.startsWith("http") || logoUrl.startsWith("/"))) ||
    logoUrl;

  return isValidImage ? logoUrl : "/placeholder.png"; // 👈
};

/**
 * Helper function to convert "HH:MM AM/PM" string to minutes from midnight (0-1439).
 */
const parseTimeToMinutes = (timeStr: string): number | null => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;

  const [, hoursStr, minutesStr, period] = match;
  if (!hoursStr || !minutesStr || !period) {
    return null;
  }
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Convert to 24-hour format
  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

interface VendorIn {
  openingTime?: string;
  closingTime?: string;
  isOpen?: boolean;
}

/**
 * Determines if a vendor is currently open based on time strings.
 * Handles standard times (9 AM - 5 PM) and overnight shifts (10 PM - 2 AM).
 */
export const isVendorOpen = (vendor: VendorIn): boolean => {
  if (vendor.isOpen) {
    return vendor.isOpen;
  }
  const openingTime = vendor.openingTime;
  const closingTime = vendor.closingTime;
  // 1. Safety check: If times are missing, we default to closed
  // (or assume open depending on your business logic, usually false is safer)
  if (!openingTime || !closingTime) return false;

  // 2. Parse times to minutes
  const startMinutes = parseTimeToMinutes(openingTime);
  const endMinutes = parseTimeToMinutes(closingTime);

  // If parsing fails (invalid format), return false
  if (startMinutes === null || endMinutes === null) return false;

  // 3. Get current time in minutes
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 4. Compare ranges
  if (startMinutes < endMinutes) {
    // Standard Day Shift (e.g., 09:00 AM to 05:00 PM)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Overnight Shift (e.g., 10:00 PM to 02:00 AM)
    // Open if: We are past opening time (late night) OR before closing time (early morning)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
};
