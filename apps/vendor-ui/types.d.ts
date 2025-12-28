// ===============================
// ENUMS (Mapped from Prisma to TypeScript Union Types)
// ===============================

declare type Role = "VENDOR" | "ADMIN";
declare type VehicleType = "MOTORCYCLE" | "BIKE" | "CAR" | "BICYCLE";
declare type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
declare type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
declare type DeliveryStatus =
  | "WAITING_PICKUP"
  | "PICKED_UP"
  | "DELIVERING"
  | "DELIVERED";

// ===============================
// CORE TYPES (Matching DB Embedded Types)
// ===============================

declare interface Coordinates {
  lat: number; // Prisma Float
  long: number; // Prisma Float
}

declare interface Address {
  address: string; // Human-readable formatted address
  state?: string;
  country?: string;
  coordinates: Coordinates;
}

declare type Attributes<T> = Record<string, T>; // Represents Prisma Json?

// ===============================
// MODELS (Matching DB Models)
// ===============================

declare interface User {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  isVerified: boolean;
  address?: Address[]; // Matches DB array of embedded Address
}

declare interface Vendor {
  id: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  logoUrl?: string;
  rating?: number; // Prisma Float to number
  isActive: boolean;
  isVerified: boolean;
  isApproved: boolean;
  description?: sting;
  openingTime: string;
  closingTime: string;
  category: string;
  address: Address; // Vendor only has one embedded Address
  avrgPreparationTime: string;

  // Frontend/Derived fields (not directly in DB, but necessary for UI lists)
  isOpen: boolean;
  distance?: number;
  // avrgPreparationTime?: string; // Derived info
}

interface Rider {
  id: string;
  fullName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  vehicleType: VehicleType;
  rating?: number;
}

declare interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number; // Prisma Float to number
  stock?: number; // Prisma Int to number
  isAvailable: boolean;
}

declare interface Product {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  basePrice: number; // Prisma Float to number
  sku?: string;
  attributes?: Attributes; // Prisma Json to Record<string, any>
  isAvailable: boolean;
  imageUrl: string;

  // Relations (required for frontend display)
  variants: ProductVariant[];
  vendor: {
    // Simplified relation data for product card view
    id: string;
    businessName: string;
    logoUrl?: string;
    // isOpen?: boolean;
    isActive: boolean;
    openingTime: string;
    closingTime: string;
    address?: Address; // Derived from Vendor.address
  };
}

declare interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number; // Prisma Int to number
  price: number; // Prisma Float to number

  // Denormalized fields for simple display:
  name: string; // Product/Variant name
  description?: string;
}

declare interface OrderHistory {
  id: string;
  status: OrderStatus;
  actorType?: Role; // "VENDOR" | "RIDER" | "SYSTEM" | "ADMIN"
  note?: string;
  createdAt: string; // Prisma DateTime to ISO String
}

declare interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  riderId?: string;
  status: OrderStatus; // Use imported OrderStatus
  deliveryAddress: Address; // Use imported Address
  deliveryVerificationCode?: string;
  totalAmount: number; // Prisma Float to number
  paymentStatus: PaymentStatus; // Use imported PaymentStatus
  placedAt: string; // Prisma DateTime to ISO String
  deliveredAt?: string; // Prisma DateTime to ISO String

  // Relations
  items: OrderItem[];
  history: OrderHistory[]; // Used for tracking

  // Derived/Frontend-specific fields:
  orderTime: string; // Alias placedAt for display
  estimatedDelivery?: string; // Derived
  tracking: OrderHistory[]; // Alias history for tracking
}

// ===============================
// UTILITY/FORM TYPES
// ===============================

declare interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number; // Added from common pagination logic
}

declare interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}

declare interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  message?: string;
  details?: any;
}
