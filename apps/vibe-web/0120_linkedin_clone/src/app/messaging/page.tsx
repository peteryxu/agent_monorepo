"use client"

import { useState } from "react"
import { Search, Edit, MoreHorizontal, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { conversations, currentUser } from "@/lib/mock-data"
import { getInitials, formatRelativeTime, cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left",
        isSelected && "bg-accent",
        conversation.unreadCount > 0 && "bg-primary/5"
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
        <AvatarFallback>{getInitials(conversation.participant.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-medium truncate",
            conversation.unreadCount > 0 && "font-semibold"
          )}>
            {conversation.participant.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {conversation.lastMessage && formatRelativeTime(conversation.lastMessage.createdAt)}
          </span>
        </div>
        <p className={cn(
          "text-sm truncate",
          conversation.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"
        )}>
          {conversation.lastMessage?.content || "No messages yet"}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  )
}

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0] || null
  )
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content - messaging */}
        <main className="flex-1 min-w-0 flex pb-24 md:pb-0">
          {/* Conversations list */}
          <Card className="w-full md:w-[320px] flex-shrink-0 flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="font-semibold">Messaging</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))}
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No conversations found
                </div>
              )}
            </div>
          </Card>

          {/* Chat view */}
          <Card className="hidden md:flex flex-1 flex-col h-[calc(100vh-2rem)] my-4 mx-4 overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedConversation.participant.avatar}
                        alt={selectedConversation.participant.name}
                      />
                      <AvatarFallback>
                        {getInitials(selectedConversation.participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConversation.participant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.participant.headline}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const isOwn = message.senderId === currentUser.id
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isOwn && "flex-row-reverse"
                        )}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={
                              isOwn
                                ? currentUser.avatar
                                : selectedConversation.participant.avatar
                            }
                          />
                          <AvatarFallback>
                            {getInitials(
                              isOwn
                                ? currentUser.name
                                : selectedConversation.participant.name
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-secondary rounded-tl-none"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
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

                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          // Would send message here
                          setMessageInput("")
                        }
                      }}
                    />
                    <Button size="icon" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
