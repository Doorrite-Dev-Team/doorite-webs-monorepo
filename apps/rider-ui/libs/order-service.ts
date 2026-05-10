import { apiClient } from "./api-client";
import { Order } from "@/store/orderAtom";

export const orderService = {
  /**
   * Get all orders assigned to the rider.
   * Can be filtered by status (e.g. 'OUT_FOR_DELIVERY', 'ACCEPTED')
   */
  async getRiderOrders(status?: string, page = 1, limit = 20): Promise<{ orders: Order[], pagination: any }> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await apiClient.get(`/riders/orders?${params.toString()}`);
    return res.data;
  },

  /**
   * Get specific order details
   */
  async getOrderById(orderId: string): Promise<Order> {
    const res = await apiClient.get(`/riders/orders/${orderId}`);
    return res.data;
  },

  /**
   * Claim an available order
   */
  async claimOrder(orderId: string): Promise<Order> {
    const res = await apiClient.post(`/riders/orders/${orderId}/claim`);
    return res.data;
  },

  /**
   * Decline an available order
   */
  async declineOrder(orderId: string): Promise<void> {
    await apiClient.post(`/riders/orders/${orderId}/decline`);
  },

  /**
   * Generate confirmation code for pickup
   */
  async generateConfirmationCode(orderId: string): Promise<{ code: string }> {
    const res = await apiClient.get(`/riders/orders/${orderId}/confirm`);
    return res.data;
  },

  /**
   * Verify delivery with code
   */
  async verifyDelivery(orderId: string, code: string): Promise<void> {
    await apiClient.post(`/riders/orders/${orderId}/verify-delivery`, { code });
  }
};
