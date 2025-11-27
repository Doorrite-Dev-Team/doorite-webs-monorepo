export function humanizePath(pathname: string) {
  // fallback: derive from last segment
  const segs = pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1];

  // friendly convert e.g. order-details -> Order Details, orderId -> Order Id
  const words = last
    ?.replace(/[-_]/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  return words?.replace(/\b\w/g, (c) => c.toUpperCase());
}

export type status =
  | "delivered"
  | "preparing"
  | "cancelled"
  | "incoming"
  | "out-for-delivery";

export const getStatusColor = (status: status) => {
  const colors = {
    delivered: "bg-green-100 text-green-800 border-green-200",
    "out-for-delivery": "bg-blue-100 text-blue-800 border-blue-200",
    preparing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    incoming: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const getStatusText = (status: status) => {
  const statusTexts = {
    delivered: "Delivered",
    "out-for-delivery": "Out for Delivery",
    preparing: "Preparing",
    cancelled: "Cancelled",
    incoming: "Incoming",
  };
  return statusTexts[status] || status;
};

export const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (timeString: string) => {
  return new Date(timeString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getInitials = (s: string) => {
  const splices = s.split(" ");
  let I = "";
  for (const splice of splices) {
    I += splice[0]?.toUpperCase();
  }
  return I;
};
