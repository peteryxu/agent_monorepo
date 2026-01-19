"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings, Mail, Search, PenSquare } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { messages } from "@/lib/mock-data"
import { formatRelativeTime, cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/tweet/verified-badge"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.participant.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          m.participant.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : messages

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content - Messages list */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="font-bold text-xl">Messages</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-accent transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-accent transition-colors">
                  <PenSquare className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Direct Messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border text-left",
                    selectedMessage === message.id && "bg-accent/50"
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={message.participant.avatar}
                      alt={message.participant.name}
                    />
                    <AvatarFallback>
                      {message.participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold truncate">
                        {message.participant.name}
                      </span>
                      {message.participant.verified && <VerifiedBadge />}
                      <span className="text-muted-foreground truncate">
                        @{message.participant.username}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-sm">
                        {formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "truncate text-sm",
                        message.unread
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.lastMessage}
                    </p>
                  </div>
                  {message.unread && (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-bold text-2xl mb-1">
                  Welcome to your inbox!
                </h2>
                <p className="text-muted-foreground">
                  Drop a line, share posts and more with private conversations
                  between you and others on X.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right side - Message detail (empty state for now) */}
        <div className="hidden lg:flex flex-1 min-w-[350px] border-r border-border items-center justify-center text-center px-8">
          <div>
            <h2 className="font-bold text-3xl mb-1">Select a message</h2>
            <p className="text-muted-foreground">
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
