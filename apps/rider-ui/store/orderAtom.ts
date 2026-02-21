// store/orderAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
