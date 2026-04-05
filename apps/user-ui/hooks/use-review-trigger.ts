"use client";

import { useState, useEffect, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { socketAtom } from "@/store/socketAtom";
import { userAtom } from "@/store/userAtom";
import { api } from "@/actions/api";

export interface PendingOrder {
  id: string;
  vendor: { id: string; businessName: string; logoUrl?: string };
  totalAmount: number;
  deliveredAt: string;
  items: Array<{ product: { id: string; name: string }; quantity: number }>;
}

export function useReviewTrigger() {
  const [user] = useAtom(userAtom);
  const socket = useAtomValue(socketAtom);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<PendingOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const checkPendingReviews = useCallback(async () => {
    if (!user?.id) return;

    const orders = await api.fetchPendingReviews();
    if (orders.length === 0) return;

    const undismissed = orders.filter(
      (order) => !sessionStorage.getItem(`hasDismissedReview_${order.id}`),
    );

    if (undismissed.length > 0) {
      setPendingOrders(undismissed);
      setCurrentOrder(undismissed[0] ?? null);
      setModalOpen(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleNotification = (data: {
      type: string;
      metadata?: { orderId?: string };
    }) => {
      if (data.type === "ORDER_DELIVERED") {
        setTimeout(() => {
          checkPendingReviews();
        }, 1000);
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, user?.id, checkPendingReviews]);

  useEffect(() => {
    if (user?.id) {
      checkPendingReviews();
    }
  }, [user?.id, checkPendingReviews]);

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open && pendingOrders.length > 1) {
      setCurrentOrder(pendingOrders[1] ?? null);
      setModalOpen(true);
    }
  };

  const handleSuccess = () => {
    if (currentOrder) {
      setPendingOrders((prev) => prev.filter((o) => o.id !== currentOrder.id));
      if (pendingOrders.length > 1) {
        setCurrentOrder(pendingOrders[1] ?? null);
        setModalOpen(true);
      } else {
        setCurrentOrder(null);
      }
    }
  };

  return {
    modalOpen,
    currentOrder,
    pendingOrders,
    setModalOpen,
    handleOpenChange,
    handleSuccess,
    checkPendingReviews,
  };
}
