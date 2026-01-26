"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type Notification } from "@/lib/types";
import { NotificationItem } from "./notification-item";
import { cn } from "@/lib/utils";

interface NotificationGroupProps {
  title: string;
  notifications: Notification[];
  defaultExpanded?: boolean;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationGroup({
  title,
  notifications,
  defaultExpanded = true,
  onMarkAsRead,
}: NotificationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (notifications.length === 0) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-[var(--muted)] transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
          )}
          <span className="text-sm font-semibold">{title}</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-[var(--primary)] text-[var(--primary-foreground)] px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-[5000px]" : "max-h-0"
        )}
      >
        <div className="divide-y divide-[var(--border)]">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to group notifications by date
export function groupNotificationsByDate(notifications: Notification[]): {
  today: Notification[];
  thisWeek: Notification[];
  earlier: Notification[];
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const today: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];

  // Sort notifications by date (newest first)
  const sorted = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  for (const notification of sorted) {
    const notifDate = notification.createdAt;

    if (notifDate >= todayStart) {
      today.push(notification);
    } else if (notifDate >= weekStart) {
      thisWeek.push(notification);
    } else {
      earlier.push(notification);
    }
  }

  return { today, thisWeek, earlier };
}
