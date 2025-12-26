export function humanizePath(pathname: string) {
  // fallback: derive from last segment
  const segs = pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1];

  // friendly convert e.g. order-details -> Order Details, orderId -> Order Id
  const words = last
    ?.replace(/[-_]/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  return words?.replace(/\b\w/g, (c) => c.toUpperCase());
}

// export type status =
//   | "delivered"
//   | "preparing"
//   | "cancelled"
//   | "incoming"
//   | "out-for-delivery";

// export const getStatusColor = (status: status) => {
//   const colors = {
//     delivered: "bg-green-100 text-green-800 border-green-200",
//     "out-for-delivery": "bg-blue-100 text-blue-800 border-blue-200",
//     preparing: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     cancelled: "bg-red-100 text-red-800 border-red-200",
//     incoming: "bg-purple-100 text-purple-800 border-purple-200",
//   };
//   return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
// };

// export const formatTime = (timeString: string) => {
//   return new Date(timeString).toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// export const formatDate = (timeString: string) => {
//   return new Date(timeString).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// export const getInitials = (s: string) => {
//   const splices = s.split(" ");
//   let I = "";
//   for (const splice of splices) {
//     I += splice[0]?.toUpperCase();
//   }
//   return I;
// };

// Format time from ISO string or Date
export function formatTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Format date from ISO string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date and time
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(dateString);
}

// Get status color class for badges
export function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PREPARING":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "DELIVERED":
      return "bg-green-100 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// Get human-readable status label
export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "Order Placed";
    case "ACCEPTED":
      return "Order Accepted";
    case "PREPARING":
      return "Preparing Your Order";
    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return (status as string).replace("_", " ");
  }
}

// Get payment status label
export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "Payment Pending";
    case "SUCCESSFUL":
      return "Paid";
    case "FAILED":
      return "Payment Failed";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
}

// Get payment status color
export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "SUCCESSFUL":
      return "bg-green-100 text-green-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "REFUNDED":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// Calculate estimated delivery time based on order status
export function calculateEstimatedDelivery(
  placedAt: string,
  status: OrderStatus,
): string {
  const placed = new Date(placedAt);
  let estimatedMinutes = 45; // Default

  switch (status) {
    case "PENDING":
      estimatedMinutes = 45;
      break;
    case "ACCEPTED":
      estimatedMinutes = 40;
      break;
    case "PREPARING":
      estimatedMinutes = 30;
      break;
    case "OUT_FOR_DELIVERY":
      estimatedMinutes = 15;
      break;
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
  }

  const estimated = new Date(placed.getTime() + estimatedMinutes * 60000);
  return formatTime(estimated);
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  return phone;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Check if order can be cancelled
export function canCancelOrder(status: OrderStatus): boolean {
  return status === "PENDING" || status === "ACCEPTED";
}

// Check if order tracking is available
export function hasTracking(status: OrderStatus): boolean {
  return (
    status === "OUT_FOR_DELIVERY" ||
    status === "PREPARING" ||
    status === "ACCEPTED"
  );
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.long - coord1.long);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

interface ProductWithBasePrice {
  basePrice: number;
}

/**
 * Calculates the median value of a numerical array.
 */
const calculateMedian = (prices: number[]): number => {
  if (prices.length === 0) return 0;

  const sortedPrices = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sortedPrices.length / 2);

  if (sortedPrices.length % 2 === 1) {
    return sortedPrices[mid]!;
  } else {
    return (sortedPrices[mid - 1]! + sortedPrices[mid]!) / 2;
  }
};

export const calculateVendorPriceRange = (
  products: ProductWithBasePrice[],
): string => {
  if (!products || products.length === 0) {
    return "N/A";
  }

  const prices = products.map((p) => p.basePrice);

  // Use the median price for robust classification
  const medianPrice = calculateMedian(prices);

  // Illustrative Tiers set for Nigerian Naira (₦).
  // These values should be adjusted based on current market data:
  // $ (Low): Median price <= ₦2000
  // $$ (Mid): ₦2000 < Median price <= ₦5000
  // $$$ (High): Median price > ₦5000
  const TIER_1_MAX = 2000;
  const TIER_2_MAX = 5000;

  if (medianPrice <= TIER_1_MAX) {
    return "$";
  } else if (medianPrice <= TIER_2_MAX) {
    return "$$";
  } else {
    return "$$$";
  }
};
