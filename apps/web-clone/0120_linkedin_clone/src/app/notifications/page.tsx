"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  UserPlus,
  UserCheck,
  MessageSquare,
  AtSign,
  Briefcase,
  Eye,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { notifications } from "@/lib/mock-data"
import { getInitials, formatRelativeTime, truncate } from "@/lib/utils"
import { REACTION_ICONS } from "@/lib/types"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

function NotificationItem({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case "connection-request":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                {notification.actor.name}
              </Link>
              {" wants to connect"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {notification.actor.headline}
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="rounded-full h-7">Accept</Button>
              <Button size="sm" variant="outline" className="rounded-full h-7">Ignore</Button>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    case "connection-accepted":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                {notification.actor.name}
              </Link>
              {" accepted your connection request"}
            </p>
            <p className="text-xs text-muted-foreground">
              You are now connected
            </p>
          </div>
          <div className="flex items-start gap-2">
            <UserCheck className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    case "reaction":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                {notification.actor.name}
              </Link>
              {" reacted "}
              <span className="text-lg">{REACTION_ICONS[notification.reactionType]}</span>
              {" to your post"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {truncate(notification.post.content, 100)}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
      )

    case "comment":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                {notification.actor.name}
              </Link>
              {" commented on your post"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              "{truncate(notification.commentPreview, 80)}"
            </p>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    case "mention":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
            <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                {notification.actor.name}
              </Link>
              {" mentioned you in a post"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {truncate(notification.post.content, 100)}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AtSign className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    case "job-match":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          <Image
            src={notification.job.company.logo}
            alt={notification.job.company.name}
            width={48}
            height={48}
            className="rounded h-12 w-12 object-contain bg-white"
          />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold">{notification.matchScore}% match</span>
              {" for "}
              <Link href="#" className="font-semibold text-primary hover:underline">
                {notification.job.title}
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              {notification.job.company.name} • {notification.job.location}
            </p>
            <Button size="sm" className="rounded-full h-7 mt-2">
              View Job
            </Button>
          </div>
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    case "profile-view":
      return (
        <div className={cn(
          "flex gap-3 p-4 hover:bg-accent/50 transition-colors border-b",
          !notification.read && "bg-primary/5"
        )}>
          {notification.actor ? (
            <Avatar className="h-12 w-12">
              <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
              <AvatarFallback>{getInitials(notification.actor.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm">
              {notification.actor ? (
                <>
                  <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:text-primary hover:underline">
                    {notification.actor.name}
                  </Link>
                  {" and "}
                  {notification.viewCount > 1 ? `${notification.viewCount - 1} others` : ""}
                </>
              ) : (
                <span className="font-semibold">{notification.viewCount} people</span>
              )}
              {" viewed your profile"}
            </p>
            <p className="text-xs text-muted-foreground">
              See all views in your dashboard
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>
      )

    default:
      return null
  }
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "jobs") return n.type === "job-match"
    if (activeTab === "posts") return ["reaction", "comment", "mention"].includes(n.type)
    return true
  })

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] px-4 py-4 pb-24 md:pb-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="all"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="jobs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("jobs")}
                  >
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                    onClick={() => setActiveTab("posts")}
                  >
                    My Posts
                  </TabsTrigger>
                </TabsList>

                <div>
                  {filteredNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                  {filteredNotifications.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 py-4 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manage notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                View settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                Mark all as read
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
