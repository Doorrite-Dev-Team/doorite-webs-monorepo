export class PaymentService {
  // Get backend payment method (no client mapping needed - use backend types directly)
  static getPaymentMethod(method: BackendPaymentMethod): BackendPaymentMethod {
    return method;
  }

  // Get payment method display name
  static getPaymentMethodDisplayName(method: BackendPaymentMethod): string {
    switch (method) {
      case "PAYSTACK":
        return "Card Payment";
      case "CASH_ON_DELIVERY":
        return "Cash on Delivery";
      default:
        return "Unknown Payment Method";
    }
  }

  // Get payment method description
  static getPaymentMethodDescription(method: BackendPaymentMethod): string {
    switch (method) {
      case "PAYSTACK":
        return "Pay securely with your debit/credit card";
      case "CASH_ON_DELIVERY":
        return "Pay when your order arrives";
      default:
        return "Select a payment method";
    }
  }

  // Validate payment method
  static isValidPaymentMethod(method: string): method is BackendPaymentMethod {
    return method === "PAYSTACK" || method === "CASH_ON_DELIVERY";
  }

  // Check if payment method is available (COD disabled for now)
  static isPaymentMethodAvailable(method: BackendPaymentMethod): boolean {
    // Only card payment is available for now
    return method === "PAYSTACK";
  }
}
