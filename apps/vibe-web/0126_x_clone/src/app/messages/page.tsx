"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Search, Edit, Send } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { conversations, currentUser, generateMessages } from "@/lib/mock-data"
import { formatRelativeTime, cn } from "@/lib/utils"
import type { ConversationId } from "@/lib/types"

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<ConversationId | null>(conversations[0]?.id || null)
  const [messageInput, setMessageInput] = useState("")

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )
  const otherParticipant = selectedConversation?.participants.find(
    (p) => p.id !== currentUser.id
  )
  const messages = selectedConversationId
    ? generateMessages(selectedConversationId)
    : []

  const handleSend = () => {
    if (!messageInput.trim()) return
    setMessageInput("")
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Messages section */}
        <div className="flex-1 flex h-screen">
          {/* Conversation list */}
          <div className="w-full max-w-[380px] border-r border-border flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Edit className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Direct Messages"
                  className="pl-12 rounded-full bg-muted border-0"
                />
              </div>
            </div>

            {/* Conversation list */}
            <ScrollArea className="flex-1">
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
                      "w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                      isSelected && "bg-muted"
                    )}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={other.avatar} />
                      <AvatarFallback>{other.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold truncate">{other.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatRelativeTime(conversation.updatedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        @{other.username}
                      </p>
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.sender.id === currentUser.id
                            ? "You: "
                            : ""}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </ScrollArea>
          </div>

          {/* Message thread */}
          {selectedConversation && otherParticipant ? (
            <div className="flex-1 flex flex-col max-w-[600px] border-r border-border">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Link href={`/profile/${otherParticipant.username}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant.avatar} />
                    <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/profile/${otherParticipant.username}`}
                    className="font-bold hover:underline"
                  >
                    {otherParticipant.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    @{otherParticipant.username}
                  </p>
                </div>
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
                          <AvatarFallback>
                            {message.sender.name[0]}
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
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
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
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Start a new message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    className="rounded-full"
                  />
                  <Button
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                  >
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
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
