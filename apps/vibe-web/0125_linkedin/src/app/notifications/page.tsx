"use client"

import Link from "next/link"
import {
  UserPlus,
  UserCheck,
  ThumbsUp,
  MessageSquare,
  AtSign,
  Briefcase,
  Eye,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn, formatRelativeTime, getInitials } from "@/lib/utils"
import { notifications } from "@/lib/mock-data"
import { getReactionEmoji } from "@/components/post/reaction-picker"
import type { Notification } from "@/lib/types"

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "connection-request":
      return <UserPlus className="h-4 w-4 text-primary" />
    case "connection-accepted":
      return <UserCheck className="h-4 w-4 text-success" />
    case "reaction":
      return <ThumbsUp className="h-4 w-4 text-primary" />
    case "comment":
      return <MessageSquare className="h-4 w-4 text-primary" />
    case "mention":
      return <AtSign className="h-4 w-4 text-primary" />
    case "job-match":
      return <Briefcase className="h-4 w-4 text-success" />
    case "profile-view":
      return <Eye className="h-4 w-4 text-muted-foreground" />
  }
}

function NotificationContent({ notification }: { notification: Notification }) {
  switch (notification.type) {
    case "connection-request":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link href={`/profile/${notification.from.firstName.toLowerCase()}`} className="font-semibold hover:underline">
              {notification.from.firstName} {notification.from.lastName}
            </Link>{" "}
            sent you a connection request
          </p>
          {notification.note && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              "{notification.note}"
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <Button size="sm" className="h-7 text-xs">Accept</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Ignore</Button>
          </div>
        </div>
      )

    case "connection-accepted":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link href={`/profile/${notification.user.firstName.toLowerCase()}`} className="font-semibold hover:underline">
              {notification.user.firstName} {notification.user.lastName}
            </Link>{" "}
            accepted your connection request
          </p>
          <Button variant="outline" size="sm" className="h-7 text-xs mt-2">
            Message
          </Button>
        </div>
      )

    case "reaction":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link href={`/profile/${notification.actor.firstName.toLowerCase()}`} className="font-semibold hover:underline">
              {notification.actor.firstName} {notification.actor.lastName}
            </Link>{" "}
            reacted {getReactionEmoji(notification.reactionType)} to your post
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.post.content}
          </p>
        </div>
      )

    case "comment":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link href={`/profile/${notification.actor.firstName.toLowerCase()}`} className="font-semibold hover:underline">
              {notification.actor.firstName} {notification.actor.lastName}
            </Link>{" "}
            commented on your post
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            "{notification.comment}"
          </p>
        </div>
      )

    case "mention":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link href={`/profile/${notification.actor.firstName.toLowerCase()}`} className="font-semibold hover:underline">
              {notification.actor.firstName} {notification.actor.lastName}
            </Link>{" "}
            mentioned you in a post
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.post.content}
          </p>
        </div>
      )

    case "job-match":
      return (
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold">{notification.job.title}</span> at{" "}
            {notification.job.company.name} matches your profile
          </p>
          <Badge variant="success" className="mt-1 text-xs">
            {notification.matchScore}% match
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs mt-2 block">
            View job
          </Button>
        </div>
      )

    case "profile-view":
      return (
        <div className="flex-1 min-w-0">
          {notification.viewer ? (
            <p className="text-sm">
              <Link href={`/profile/${notification.viewer.firstName.toLowerCase()}`} className="font-semibold hover:underline">
                {notification.viewer.firstName} {notification.viewer.lastName}
              </Link>{" "}
              viewed your profile
            </p>
          ) : (
            <p className="text-sm">
              Someone viewed your profile
              {notification.viewerTitle && (
                <span className="text-muted-foreground">
                  {" "}· {notification.viewerTitle}
                </span>
              )}
            </p>
          )}
        </div>
      )
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 p-4 hover:bg-muted/50 transition-colors",
                  !notification.read && "bg-primary/5"
                )}
              >
                {/* Avatar or Icon */}
                <div className="relative shrink-0">
                  {"from" in notification && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={notification.from.avatar} />
                      <AvatarFallback>
                        {getInitials(notification.from.firstName, notification.from.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {"actor" in notification && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={notification.actor.avatar} />
                      <AvatarFallback>
                        {getInitials(notification.actor.firstName, notification.actor.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {"user" in notification && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>
                        {getInitials(notification.user.firstName, notification.user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {"viewer" in notification && notification.viewer && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={notification.viewer.avatar} />
                      <AvatarFallback>
                        {getInitials(notification.viewer.firstName, notification.viewer.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {"job" in notification && (
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-success" />
                    </div>
                  )}
                  {notification.type === "profile-view" && !notification.viewer && (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card flex items-center justify-center">
                    <NotificationIcon type={notification.type} />
                  </div>
                </div>

                <NotificationContent notification={notification} />

                <span className="text-xs text-muted-foreground shrink-0">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
