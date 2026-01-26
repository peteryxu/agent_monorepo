"use client";

import { useState, useEffect, useMemo } from "react";
import { Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  NotificationGroup,
  groupNotificationsByDate,
} from "@/components/notification/notification-group";
import { NotificationSettings } from "@/components/notification/notification-settings";
import { notifications as mockNotifications, currentUser } from "@/lib/mock-data";
import { type Notification } from "@/lib/types";

type FilterType = "all" | "my-posts" | "mentions";

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [notificationState, setNotificationState] = useState<Notification[]>([]);

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    // Filter notifications for the current user
    const userNotifications = mockNotifications.filter(
      (n) => n.forUserId === currentUser.id
    );
    setNotificationState(userNotifications);
    setMounted(true);
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (!mounted) return [];

    switch (activeFilter) {
      case "my-posts":
        return notificationState.filter(
          (n) => n.type === "like" || n.type === "comment"
        );
      case "mentions":
        return notificationState.filter((n) => n.type === "mention");
      case "all":
      default:
        return notificationState;
    }
  }, [notificationState, activeFilter, mounted]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    if (!mounted) return { today: [], thisWeek: [], earlier: [] };
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications, mounted]);

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotificationState((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotificationState((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notificationState.filter((n) => !n.read).length;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold">Notifications</h1>
                {mounted && unreadCount > 0 && (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSettingsOpen(true)}
                  title="Notification settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs
              value={activeFilter}
              onValueChange={(v) => setActiveFilter(v as FilterType)}
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                  <TabsTrigger value="mentions">Mentions</TabsTrigger>
                </TabsList>

                {mounted && unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all as read
                  </Button>
                )}
              </div>
            </Tabs>
          </div>
        </Card>

        {/* Notification List */}
        <Card>
          {mounted ? (
            filteredNotifications.length > 0 ? (
              <div>
                <NotificationGroup
                  title="Today"
                  notifications={groupedNotifications.today}
                  defaultExpanded={true}
                  onMarkAsRead={handleMarkAsRead}
                />
                <NotificationGroup
                  title="This Week"
                  notifications={groupedNotifications.thisWeek}
                  defaultExpanded={true}
                  onMarkAsRead={handleMarkAsRead}
                />
                <NotificationGroup
                  title="Earlier"
                  notifications={groupedNotifications.earlier}
                  defaultExpanded={false}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-[var(--muted-foreground)]">
                  No notifications to show
                </p>
              </div>
            )
          ) : (
            // Loading skeleton
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-[var(--muted)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--muted)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Settings Dialog */}
      <NotificationSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
