declare type Vendor = {
  id: number;
  businessName: string;
  image?: StaticImageData;
  logoUrl?: string;
  avrgPreparationTime?: string;
  description?: string;
  category: string;
  subcategory?: string;
  rating?: number;
  distance?: number;
  isOpen: boolean;
  priceRange?: string;
  tags?: string[];
};

declare type Order = {
  id: string;
  status: status;
  items: string[];
  total: number;
  orderTime: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  tracking: {
    step: string;
    time: string;
    completed: boolean;
  }[];
  orderDetails: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

declare type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  address?: string;
};

declare type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isAvailable: boolean;
  vendor: {
    id: string;
    businessName: string;
    logoUrl?: string;
  };
};

declare type CartItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  vendor_name: string;
  quantity: number;
};

declare type SuccessResponse<T> = {
  ok: true;
} & T;

// 3. Error Type (the discriminant MUST be different)
declare type ErrorResponse = {
  ok: false;
  error: string; // Guaranteed error message
};

// 4. The Final API Contract
declare type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

declare interface ClientError {
  message: string;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any; // Matches your existing structure
  isClientError: true; // Used for easy identification/narrowing
}
