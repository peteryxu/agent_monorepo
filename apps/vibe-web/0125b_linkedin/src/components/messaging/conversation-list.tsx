"use client"

import { useState } from "react"
import { Search, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User, Conversation, ConversationId } from "@/lib/types"

interface ConversationWithUser extends Conversation {
  otherUser: User
  isOnline?: boolean
}

interface ConversationListProps {
  conversations: ConversationWithUser[]
  activeConversationId?: ConversationId
  onSelectConversation: (conversationId: ConversationId) => void
  onNewMessage?: () => void
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewMessage,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <div className="flex flex-col h-full border-r border-[var(--border)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Messaging</h2>
          <Button variant="ghost" size="icon" onClick={onNewMessage}>
            <Edit className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-[var(--border)]">
          {filteredConversations.map((conversation) => {
            const initials = conversation.otherUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()

            const isActive = conversation.id === activeConversationId
            const hasUnread = conversation.unreadCount > 0

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full p-3 flex items-start gap-3 hover:bg-[var(--muted)]/50 transition-colors text-left",
                  isActive && "bg-[var(--muted)]"
                )}
              >
                {/* Avatar with online indicator */}
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.name}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[var(--card)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={cn(
                        "text-sm truncate",
                        hasUnread ? "font-semibold" : "font-medium"
                      )}
                    >
                      {conversation.otherUser.name}
                    </h4>
                    <span className="text-xs text-[var(--muted-foreground)] shrink-0">
                      {conversation.lastMessage &&
                        formatMessageTime(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-xs truncate",
                        hasUnread
                          ? "text-[var(--foreground)] font-medium"
                          : "text-[var(--muted-foreground)]"
                      )}
                    >
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                    {hasUnread && (
                      <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredConversations.length === 0 && (
          <div className="p-4 text-center text-[var(--muted-foreground)]">
            No conversations found
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
