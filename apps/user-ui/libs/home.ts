/**
 * Get greeting based on time of day
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Order statuses that indicate an active order
 * These orders should show the order tracker
 */
const ACTIVE_ORDER_STATUSES = ["OUT_FOR_DELIVERY", "PREPARING"] as const;

type ActiveOrderStatus = (typeof ACTIVE_ORDER_STATUSES)[number];

/**
 * Check if an order status is considered "active"
 * Active orders are those currently being prepared or out for delivery
 */
export function isActiveOrderStatus(
  status: string,
): status is ActiveOrderStatus {
  return ACTIVE_ORDER_STATUSES.includes(status as ActiveOrderStatus);
}

/**
 * Find the first active order from a list of orders
 * Returns undefined if no active orders found
 */
export function findActiveOrder(orders: Order[]): Order | undefined {
  return orders.find((order) => isActiveOrderStatus(order.status));
}

/**
 * Check if there are any active orders in the list
 */
export function hasActiveOrders(orders: Order[]): boolean {
  return orders.some((order) => isActiveOrderStatus(order.status));
}

/**
 * Get status color classes for active order banner
 */
export function getActiveOrderStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PREPARING: "bg-amber-50 border-amber-200 text-amber-800",
    OUT_FOR_DELIVERY: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return statusColors[status] ?? "bg-gray-50 border-gray-200 text-gray-800";
}

/**
 * Format user display name with fallback
 */
export function getUserDisplayName(user: User | null): string {
  return user?.fullName || "Guest";
}

/**
 * Get user's first name from full name
 */
export function getUserFirstName(user: User | null): string {
  if (!user?.fullName) return "there";
  return user.fullName.split(" ")[0] ?? "there";
}

/**
 * Get user initials from full name
 * Returns up to 2 uppercase initials
 */
export function getUserInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
