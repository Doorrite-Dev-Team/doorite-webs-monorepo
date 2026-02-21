export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  const colors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "outline",
    ACCEPTED: "default",
    PREPARING: "secondary",
    OUT_FOR_DELIVERY: "default",
    DELIVERED: "default",
    CANCELLED: "destructive",
  };
  return colors[status] || "outline";
};

export const getStatusLabel = (status: string) => {
  return status.replace(/_/g, " ");
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDateTime = (dateString: string) => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

// const getNextStatus = (currentStatus: string) => {
//   const statusFlow: Record<string, string> = {
//     PENDING: "ACCEPTED",
//     ACCEPTED: "PREPARING",
//     PREPARING: "OUT_FOR_DELIVERY",
//   };
//   return statusFlow[currentStatus];
// };

export const getStatusActions = (status: string) => {
  if (status === "PENDING") {
    return [
      {
        label: "Accept Order",
        status: "ACCEPTED",
        variant: "default" as const,
      },
      {
        label: "Cancel Order",
        status: "CANCELLED",
        variant: "destructive" as const,
      },
    ];
  }
  if (status === "ACCEPTED") {
    return [
      {
        label: "Mark as Preparing",
        status: "PREPARING",
        variant: "default" as const,
      },
    ];
  }
  if (status === "PREPARING") {
    return [
      {
        label: "Mark as Ready",
        status: "OUT_FOR_DELIVERY",
        variant: "default" as const,
      },
    ];
  }
  return [];
};
