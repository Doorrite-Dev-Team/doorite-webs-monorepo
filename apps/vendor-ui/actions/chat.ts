import apiClient from "@/libs/api/client";

export interface ChatMessage {
  id: string;
  sender: "vendor" | "rider" | "customer";
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  orderId: string;
}

export interface OrderChat {
  orderId: string;
  participants: {
    vendorId: string;
    riderId?: string;
    customerId: string;
  };
  messages: ChatMessage[];
}

export async function fetchChatMessages(orderId: string): Promise<OrderChat> {
  const response = await apiClient.get(`/vendors/orders/${orderId}/chat`);
  return response.data;
}

export async function sendChatMessage(
  orderId: string,
  text: string,
): Promise<ChatMessage> {
  // Basic validation
  if (!text.trim()) {
    throw new Error("Message cannot be empty");
  }

  if (text.length > 1000) {
    throw new Error("Message too long (max 1000 characters)");
  }

  const response = await apiClient.post(`/vendors/orders/${orderId}/chat`, {
    text: text.trim(),
  });
  return response.data;
}

export async function subscribeToOrderChat(
  _orderId: string,
  _onMessage: (message: ChatMessage) => void,
) {
  // This would be socket implementation
  // In real implementation, we would connect to socket room
}

export async function unsubscribeFromOrderChat(_orderId: string) {
  // In real implementation, we would disconnect from socket room
}
