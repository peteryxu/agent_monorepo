"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Heart, Repeat2, UserPlus, MessageCircle, AtSign } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { notifications } from "@/lib/mock-data"
import { formatRelativeTime, cn } from "@/lib/utils"
import type { Notification } from "@/lib/types"

function NotificationItem({ notification }: { notification: Notification }) {
  const getIcon = () => {
    switch (notification.type) {
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
    }
  }

  const getMessage = () => {
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
    }
  }

  const getTweetContent = () => {
    switch (notification.type) {
      case "like":
      case "retweet":
      case "mention":
        return notification.tweet.content
      case "reply":
        return notification.replyTweet.content
      default:
        return null
    }
  }

  const tweetContent = getTweetContent()

  return (
    <Link
      href={
        notification.type === "follow"
          ? `/profile/${notification.actor.username}`
          : `/tweet/${
              notification.type === "reply"
                ? notification.replyTweet.id
                : notification.tweet.id
            }`
      }
      className={cn(
        "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="w-8 flex justify-end shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.actor.avatar} />
            <AvatarFallback>{notification.actor.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <p className="mt-1">
          <span className="font-bold">{notification.actor.name}</span>{" "}
          <span className="text-muted-foreground">{getMessage()}</span>
        </p>
        {tweetContent && (
          <p className="text-muted-foreground mt-1 line-clamp-2">{tweetContent}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </Link>
  )
}

export default function NotificationsPage() {
  const allNotifications = notifications
  const mentionNotifications = notifications.filter(
    (n) => n.type === "mention" || n.type === "reply"
  )

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold">Notifications</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </header>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="mentions"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                Mentions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {allNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
              {allNotifications.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No notifications yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentions" className="mt-0">
              {mentionNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
              {mentionNotifications.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No mentions yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
