"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Heart, Repeat2, UserPlus, MessageCircle, AtSign } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifications } from "@/lib/mock-data"
import { formatRelativeTime, cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/tweet/verified-badge"
import type { Notification } from "@/lib/types"
import { assertNever } from "@/lib/types"

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "like":
      return <Heart className="h-5 w-5 fill-like text-like" />
    case "retweet":
      return <Repeat2 className="h-5 w-5 text-retweet" />
    case "follow":
      return <UserPlus className="h-5 w-5 text-primary" />
    case "reply":
      return <MessageCircle className="h-5 w-5 text-primary" />
    case "mention":
      return <AtSign className="h-5 w-5 text-primary" />
    default:
      return assertNever(type)
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const getNotificationText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post"
      case "retweet":
        return "reposted your post"
      case "follow":
        return "followed you"
      case "reply":
        return "replied to your post"
      case "mention":
        return "mentioned you"
      default:
        return assertNever(notification)
    }
  }

  const getTweetPreview = () => {
    if (notification.type === "follow") return null
    if (notification.type === "reply") {
      return notification.replyTweet.content
    }
    if (notification.type === "mention") {
      return notification.tweet.content
    }
    return notification.tweet.content
  }

  const tweetPreview = getTweetPreview()

  return (
    <Link
      href={
        notification.type === "follow"
          ? `/profile/${notification.actor.username}`
          : `/tweet/${notification.type === "reply" ? notification.replyTweet.id : notification.type === "mention" ? notification.tweet.id : notification.tweet.id}`
      }
      className={cn(
        "flex gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="w-10 flex justify-end">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={notification.actor.avatar}
              alt={notification.actor.name}
            />
            <AvatarFallback>
              {notification.actor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="mt-1">
          <span className="font-bold hover:underline">
            {notification.actor.name}
          </span>
          {notification.actor.verified && (
            <VerifiedBadge className="inline ml-1" />
          )}{" "}
          <span className="text-muted-foreground">{getNotificationText()}</span>
        </p>
        {tweetPreview && (
          <p className="mt-1 text-muted-foreground line-clamp-2">
            {tweetPreview}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </Link>
  )
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "mentions">(
    "all"
  )

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "verified") {
      return n.actor.verified
    }
    if (activeTab === "mentions") {
      return n.type === "mention" || n.type === "reply"
    }
    return true
  })

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="font-bold text-xl">Notifications</h1>
              <button className="p-2 rounded-full hover:bg-accent transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) =>
                setActiveTab(v as "all" | "verified" | "mentions")
              }
              className="w-full"
            >
              <TabsList className="w-full h-auto p-0 bg-transparent rounded-none">
                <TabsTrigger
                  value="all"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                >
                  All
                  {activeTab === "all" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="verified"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                >
                  Verified
                  {activeTab === "verified" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="mentions"
                  className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative"
                >
                  Mentions
                  {activeTab === "mentions" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Notifications list */}
          <div>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No notifications yet
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[350px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
