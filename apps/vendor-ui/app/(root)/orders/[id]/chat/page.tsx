"use client";

"use client";

import OrderChatPage from "@/components/order/OrderChatPage";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderPage() {
  const { id } = useParams();
  const orderId = id as string;

  useEffect(() => {
    document.title = "Order Chat";
  }, []);

  return <OrderChatPage orderId={orderId} />;
}
