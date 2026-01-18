// Order request body matching requirements
export interface OrderRequest {
  vendorId: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  deliveryAddress: {
    address: string;
    coordinates: { lat: number; long: number };
  };
  contactInfo: {
    fullName: string;
    phone: string;
    email: string;
  };
  paymentMethod: BackendPaymentMethod;
}

// Order response matching requirements
export interface OrderResponse {
  order: {
    id: string;
    status: string;
    totalAmount: number;
    vendorId: string;
    customerId: string;
  };
  payment: {
    id: string;
    status: string;
    method: BackendPaymentMethod;
    amount: number;
  };
  nextAction: {
    type: "PAYMENT_REDIRECT" | "ORDER_CONFIRMED" | "AWAITING_PAYMENT";
    redirectUrl?: string;
    message: string;
  };
}

export class OrderService {
  // Create order with the specified format
  static async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Order creation failed");
      }

      const data = await response.json();

      // Transform response to match expected format
      return this.transformOrderResponse(data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create order",
      );
    }
  }

  // Transform API response to match OrderResponse interface
  private static transformOrderResponse(data: any): OrderResponse {
    return {
      order: {
        id: data.order?.id || data.id,
        status: data.order?.status || "PENDING",
        totalAmount: data.order?.totalAmount || data.totalAmount || 0,
        vendorId: data.order?.vendorId || data.vendorId,
        customerId: data.order?.customerId || data.customerId,
      },
      payment: {
        id: data.payment?.id || "",
        status: data.payment?.status || "PENDING",
        method: data.payment?.method || "PAYSTACK",
        amount: data.payment?.amount || data.order?.totalAmount || 0,
      },
      nextAction: {
        type: data.nextAction?.type || "AWAITING_PAYMENT",
        redirectUrl: data.nextAction?.redirectUrl,
        message: data.nextAction?.message || "Order created successfully",
      },
    };
  }

  // Get order by ID
  static async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`/api/v1/orders/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      return this.transformOrderResponse(data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch order",
      );
    }
  }

  // Validate order request before sending
  static validateOrderRequest(request: OrderRequest): string[] {
    const errors: string[] = [];

    // Validate vendorId
    if (!request.vendorId || request.vendorId.trim() === "") {
      errors.push("Vendor ID is required");
    }

    // Validate items
    if (!request.items || request.items.length === 0) {
      errors.push("At least one item is required");
    } else {
      request.items.forEach((item, index) => {
        if (!item.productId || item.productId.trim() === "") {
          errors.push(`Product ID is required for item ${index + 1}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Valid quantity is required for item ${index + 1}`);
        }
      });
    }

    // Validate delivery address
    if (!request.deliveryAddress || !request.deliveryAddress.address) {
      errors.push("Delivery address is required");
    }

    if (!request.deliveryAddress.coordinates) {
      errors.push("Delivery coordinates are required");
    } else {
      if (typeof request.deliveryAddress.coordinates.lat !== "number") {
        errors.push("Valid latitude is required");
      }
      if (typeof request.deliveryAddress.coordinates.long !== "number") {
        errors.push("Valid longitude is required");
      }
    }

    // Validate contact info
    if (!request.contactInfo) {
      errors.push("Contact information is required");
    } else {
      if (
        !request.contactInfo.fullName ||
        request.contactInfo.fullName.trim() === ""
      ) {
        errors.push("Full name is required");
      }
      if (
        !request.contactInfo.phone ||
        request.contactInfo.phone.trim() === ""
      ) {
        errors.push("Phone number is required");
      }
      if (
        !request.contactInfo.email ||
        request.contactInfo.email.trim() === ""
      ) {
        errors.push("Email is required");
      }
    }

    // Validate payment method
    if (!request.paymentMethod) {
      errors.push("Payment method is required");
    }

    return errors;
  }
}
