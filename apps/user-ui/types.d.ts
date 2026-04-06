// ===============================
// ENUMS (Mapped from Prisma to TypeScript Union Types)
// ===============================

declare type Role = "CUSTOMER" | "ADMIN";
declare type VehicleType = "MOTORCYCLE" | "BIKE" | "CAR" | "BICYCLE";
declare type OrderStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

declare type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
declare type DeliveryStatus =
  | "WAITING_PICKUP"
  | "PICKED_UP"
  | "DELIVERING"
  | "DELIVERED";

// Payment Method
declare type BackendPaymentMethod = "PAYSTACK" | "CASH_ON_DELIVERY"; // Matches DB enum

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
  bannerUrl?: string;
  rating?: number; // Prisma Float to number
  reviewCount?: number;
  isActive: boolean;
  isVerified: boolean;
  isApproved: boolean;
  description?: string;
  openingTime: string;
  closingTime: string;
  category: string;
  address: Address; // Vendor only has one embedded Address
  avrgPreparationTime: string;
  deliveryTime: string;
  deliveryFee: number;

  // Frontend/Derived fields (not directly in DB, but necessary for UI lists)
  isOpen?: boolean;
  distance?: number;

  // Frontend-specific fields
  products?: Product[];
  reviews?: ReviewItem[];
  stats?: ProductStats;
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

declare interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
  isAvailable?: boolean;
}

declare interface RatingDist {
  stars: number;
  count: number;
  percentage: number;
}

declare interface ProductStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDist[];
}

declare interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
}

declare type SortOption = "newest" | "oldest" | "highest" | "lowest";

declare interface ModifierGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
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
  rating?: number;
  reviewCount?: number;
  orderCount?: number;
  category?: string; // Added: Product category for grouping

  // Relations (required for frontend display)
  variants: ProductVariant[];
  modifierGroups?: ModifierGroup[];
  vendor: {
    // Simplified relation data for product card view
    id: string;
    businessName: string;
    logoUrl?: string;
    isOpen?: boolean;
    isActive: boolean;
    isVerified?: boolean;
    openingTime: string;
    closingTime: string;
    deliveryTime: string;
    address?: Address; // Derived from Vendor.address
    avrgPreparationTime?: string;
    deliveryFee?: number;
    deliveryTime?: string;
    distance?: number;
  };

  // Frontend-specific fields
  stats?: ProductStats;
  reviews?: ReviewItem[];
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
  imageUrl?: string;
  modifiers?: {
    modifierGroupId: string;
    modifierOptionId: string;
    name: string;
    price: number;
  }[];
}

declare interface OrderHistory {
  id: string;
  status: OrderStatus;
  actorType?: string; // "VENDOR" | "RIDER" | "SYSTEM" | "ADMIN"
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
  vendorName?: string;
  vendorLogoUrl?: string;
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

declare interface SuccessResponse<T = unknown | Record<string, string>> {
  data: {
    ok: true;
  } & T;
  message: string; // Added from previous API implementation
  ok: boolean;
}

declare interface ClientError {
  message: string;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  isClientError: true;
}

// Cart Item must carry necessary IDs for Order creation
declare interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendorName: string;
  vendorId: string;
  imageUrl?: string;
  vendorDeliveryFee: number;

  // IDs required by OrderItem model:
  variantId?: string;
  variantName?: string;
  modifiers?: {
    modifierGroupId: string;
    modifierOptionId: string;
    name: string;
    price: number;
  }[];
}

// Input format when adding to cart (from product page)
declare interface AddToCartInput {
  productId: string;
  productName: string;
  basePrice: number;
  imageUrl?: string;
  vendorId: string;
  vendorName: string;
  vendorDeliveryFee: number;
  variantId?: string;
  variantName?: string;
  quantity: number;
  modifiers?: Array<{
    modifierGroupId: string;
    selectedOptions: Array<{
      modifierOptionId: string;
      name: string;
      priceAdjustment: number;
    }>;
  }>;
}

// Form model for Checkout page, includes User contact details not in DB Address type
declare interface DeliveryAddressForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  building?: string;
  room?: string;
  instructions?: string;
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

declare interface Notification {
  title: string;
  content: string;
  action: unknow;
}

declare interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  message?: string;
  details?: any;
}
