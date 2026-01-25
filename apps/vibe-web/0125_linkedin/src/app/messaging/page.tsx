"use client"

import { useState } from "react"
import { Search, Edit, MoreHorizontal, Send, Paperclip, Smile, Image } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, formatRelativeTime, getInitials } from "@/lib/utils"
import { conversations, generateMessages, currentUser } from "@/lib/mock-data"
import type { ConversationId } from "@/lib/types"

export default function MessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<ConversationId | null>(
    conversations[0]?.id || null
  )
  const [messageInput, setMessageInput] = useState("")

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  const otherParticipant = selectedConversation?.participants.find(
    (p) => p.id !== currentUser.id
  )
  const messages = selectedConversationId ? generateMessages(selectedConversationId) : []

  const handleSend = () => {
    if (!messageInput.trim()) return
    // Would add message to conversation
    setMessageInput("")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <Card className="h-[calc(100vh-8rem)] flex">
        {/* Conversation list */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Messaging</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages"
                className="pl-9 h-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {conversations.map((conversation) => {
                const other = conversation.participants.find(
                  (p) => p.id !== currentUser.id
                )
                if (!other) return null

                const isSelected = conversation.id === selectedConversationId

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors",
                      isSelected && "bg-muted"
                    )}
                  >
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={other.avatar} />
                      <AvatarFallback>
                        {getInitials(other.firstName, other.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">
                          {other.firstName} {other.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatRelativeTime(conversation.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {conversation.lastMessage?.content}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Message view */}
        {selectedConversation && otherParticipant ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant.avatar} />
                  <AvatarFallback>
                    {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">
                    {otherParticipant.firstName} {otherParticipant.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {otherParticipant.headline}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender.id === currentUser.id

                  return (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", isOwn && "flex-row-reverse")}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(message.sender.firstName, message.sender.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {formatRelativeTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Write a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button size="icon" onClick={handleSend} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  )
}
