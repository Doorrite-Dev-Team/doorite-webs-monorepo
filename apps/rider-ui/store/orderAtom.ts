import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { orderService } from "@/libs/order-service";

export interface Order {
    id: string;
    status: "pending" | "accepted" | "picked_up" | "delivered" | "cancelled";
    pickupLocation: {
        lat: number;
        lng: number;
        address: string;
    };
    dropoffLocation: {
        lat: number;
        lng: number;
        address: string;
    };
    restaurantName?: string;
    customerName?: string;
    items?: any[];
    totalAmount?: number;
    createdAt?: string;
    estimatedDeliveryTime?: string;
}

// Active order being delivered
export const activeOrderAtom = atomWithStorage<Order | null>(
    "rider-active-order",
    null,
);

// Available orders nearby (for riders to accept)
export const availableOrdersAtom = atom<Order[]>([]);

// Order history
export const orderHistoryAtom = atomWithStorage<Order[]>(
    "rider-order-history",
    [],
);

// Fetch the rider's active assigned order
export const fetchActiveOrderAtom = atom(null, async (get, set) => {
    try {
        // According to API docs, GET /riders/orders returns assigned orders
        // We'll assume the active one is OUT_FOR_DELIVERY, PREPARING, ACCEPTED or READY_FOR_PICKUP
        const data = await orderService.getRiderOrders();
        const orders = data.orders || [];
        // Find the first order that is not delivered or cancelled
        const active = orders.find(
            (o) => !["delivered", "cancelled", "DELIVERED", "CANCELLED"].includes(o.status)
        );
        
        if (active) {
            set(activeOrderAtom, active);
        } else {
            set(activeOrderAtom, null);
        }
    } catch (error) {
        console.error("Failed to fetch active order:", error);
    }
});
