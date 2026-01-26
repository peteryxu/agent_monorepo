"use client";

import { useState } from "react";
import {
  UserPlus,
  UserCheck,
  Heart,
  MessageSquare,
  AtSign,
  Briefcase,
  Eye,
  ThumbsUp,
  PartyPopper,
  Lightbulb,
  Hand,
  Smile,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type Notification,
  type ReactionType,
  type UserId,
} from "@/lib/types";
import { usersById, jobsById, postsById } from "@/lib/mock-data";
import { cn, formatRelativeTime, getInitials, truncate } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

// Reaction emoji mapping
const reactionEmoji: Record<ReactionType, { icon: typeof ThumbsUp; color: string; label: string }> = {
  like: { icon: ThumbsUp, color: "text-[var(--primary)]", label: "liked" },
  celebrate: { icon: PartyPopper, color: "text-green-600", label: "celebrated" },
  support: { icon: Hand, color: "text-purple-600", label: "supported" },
  love: { icon: Heart, color: "text-red-500", label: "loved" },
  insightful: { icon: Lightbulb, color: "text-yellow-600", label: "found insightful" },
  funny: { icon: Smile, color: "text-teal-600", label: "found funny" },
};

// Get user by ID helper
function getUser(userId: UserId) {
  return usersById.get(userId);
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const renderNotification = () => {
    switch (notification.type) {
      case "connection-request": {
        const fromUser = getUser(notification.fromUserId);
        if (!fromUser) return null;

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={fromUser.avatar} alt={fromUser.name} />
                <AvatarFallback>{getInitials(fromUser.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-[var(--primary)] p-1">
                <UserPlus className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{fromUser.name}</span>{" "}
                <span className="text-[var(--muted-foreground)]">wants to connect</span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {fromUser.headline}
              </p>
              {fromUser.connections > 0 && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {fromUser.connections} mutual connections
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="rounded-full">
                  Accept
                </Button>
                <Button size="sm" variant="outline" className="rounded-full">
                  Ignore
                </Button>
              </div>
            </div>
          </div>
        );
      }

      case "connection-accepted": {
        const user = getUser(notification.userId);
        if (!user) return null;

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-1">
                <UserCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{user.name}</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  accepted your invitation to connect
                </span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {user.headline}
              </p>
              <div className="mt-3">
                <Button size="sm" variant="outline" className="rounded-full">
                  Message
                </Button>
              </div>
            </div>
          </div>
        );
      }

      case "like": {
        const user = getUser(notification.userId);
        const post = postsById.get(notification.postId);
        if (!user) return null;

        const reaction = reactionEmoji[notification.reactionType];
        const ReactionIcon = reaction.icon;

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className={cn("absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-sm border")}>
                <ReactionIcon className={cn("h-3 w-3", reaction.color)} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{user.name}</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  {reaction.label} your post
                </span>
              </p>
              {post && post.type === "text" && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                  {truncate(post.content, 100)}
                </p>
              )}
            </div>
            {post && post.type === "text" && post.images.length > 0 && (
              <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={post.images[0]}
                  alt="Post preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        );
      }

      case "comment": {
        const user = getUser(notification.userId);
        if (!user) return null;

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-[var(--primary)] p-1">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{user.name}</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  commented on your post
                </span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 bg-[var(--muted)] p-2 rounded-md">
                "{truncate(notification.commentPreview, 150)}"
              </p>
            </div>
          </div>
        );
      }

      case "mention": {
        const user = getUser(notification.userId);
        if (!user) return null;

        const context = notification.commentId ? "a comment" : "a post";

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-orange-500 p-1">
                <AtSign className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{user.name}</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  mentioned you in {context}
                </span>
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {user.headline}
              </p>
            </div>
          </div>
        );
      }

      case "job-match": {
        const job = jobsById.get(notification.jobId);
        if (!job) return null;

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <div className="h-12 w-12 rounded-md overflow-hidden bg-[var(--muted)] flex items-center justify-center">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Briefcase className="h-6 w-6 text-[var(--muted-foreground)]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-1">
                <Briefcase className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--muted-foreground)]">
                New job that matches your profile:
              </p>
              <p className="text-sm font-semibold mt-0.5">{job.title}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {job.companyName} · {job.location}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {job.isEasyApply && (
                  <Badge variant="secondary" className="text-xs">
                    Easy Apply
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  {notification.matchScore}% match
                </Badge>
              </div>
            </div>
          </div>
        );
      }

      case "profile-view": {
        const notableUsers = notification.notableViewers
          .map((id) => getUser(id))
          .filter(Boolean);

        return (
          <div className="flex items-start gap-3 w-full">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{notification.viewerCount} people</span>{" "}
                <span className="text-[var(--muted-foreground)]">
                  viewed your profile
                </span>
              </p>
              {notableUsers.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {notableUsers.slice(0, 3).map((user) => (
                      <Avatar key={user!.id} className="h-6 w-6 border-2 border-[var(--background)]">
                        <AvatarImage src={user!.avatar} alt={user!.name} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(user!.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    including {notableUsers[0]!.name}
                    {notableUsers.length > 1 && ` and ${notableUsers.length - 1} others`}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }

      default: {
        const _exhaustive: never = notification;
        return null;
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative px-4 py-3 cursor-pointer transition-colors",
        !notification.read && "bg-[var(--accent)]",
        isHovered && "bg-[var(--muted)]"
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[var(--primary)]" />
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">{renderNotification()}</div>
        <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap flex-shrink-0">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}
