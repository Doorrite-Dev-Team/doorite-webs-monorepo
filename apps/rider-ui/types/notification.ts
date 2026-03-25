// types/notification.ts
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export type NotificationType =
    | "NEW_ORDER" // Requires Acceptance (Dialog)
    | "ORDER_CANCELLED" // Urgent Stop (Toast + Sound)
    | "ORDER_UPDATE" // Status change
    | "SYSTEM_ALERT" // Maintenance/Auth (Toast)
    | "PAYOUT_SUCCESS"; // Info (Silent/Low)

export interface NotificationMetadata {
    orderId?: string;
    orderAmount?: number;
    customerName?: string;
    actionUrl?: string;
    [key: string]: any;
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    priority: NotificationPriority;
    read: boolean;
    archived: boolean;
    timestamp: string;
    expiresAt?: string;
    metadata?: NotificationMetadata;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    lastSync: string | null;
}
