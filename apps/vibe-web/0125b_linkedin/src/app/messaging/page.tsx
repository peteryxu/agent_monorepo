"use client"

import { useState, useEffect, useMemo } from "react"
import { MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ConversationList } from "@/components/messaging/conversation-list"
import { ConversationView } from "@/components/messaging/conversation-view"
import { users, currentUser } from "@/lib/mock-data"
import {
  type Conversation,
  type ConversationId,
  type Message,
  type User,
  createConversationId,
  createMessageId,
} from "@/lib/types"

interface ConversationWithUser extends Conversation {
  otherUser: User
  isOnline?: boolean
}

// Generate mock messages for a conversation
function generateMessages(
  conversationId: ConversationId,
  otherUser: User,
  currentUserId: string
): Message[] {
  const messageTemplates = [
    { content: "Hey, how are you?", fromOther: true },
    { content: "I'm doing great, thanks for asking! How about you?", fromOther: false },
    { content: "Pretty good! I saw your recent post about AI and found it really insightful.", fromOther: true },
    { content: "Thank you! I've been researching that topic for a while now.", fromOther: false },
    { content: "Would love to discuss it further sometime. Are you free for a call this week?", fromOther: true },
    { content: "Sure! How about Thursday afternoon?", fromOther: false },
    { content: "Perfect, Thursday works for me. Looking forward to it!", fromOther: true },
  ]

  const baseTime = new Date()
  baseTime.setHours(baseTime.getHours() - 24) // Start from 24 hours ago

  return messageTemplates.map((template, index) => {
    const msgTime = new Date(baseTime)
    msgTime.setMinutes(msgTime.getMinutes() + index * 30) // 30 min between messages

    return {
      id: createMessageId(`${conversationId}-msg-${index}`),
      conversationId,
      senderId: template.fromOther ? otherUser.id : (currentUserId as any),
      content: template.content,
      createdAt: msgTime,
      read: index < 6, // Last message might be unread
    }
  })
}

// Generate mock conversations
function generateConversations(allUsers: User[]): ConversationWithUser[] {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id).slice(0, 8)

  return otherUsers.map((user, index) => {
    const conversationId = createConversationId(`conv-${user.id}`)
    const messages = generateMessages(conversationId, user, currentUser.id)
    const lastMessage = messages[messages.length - 1]

    return {
      id: conversationId,
      participants: [currentUser.id, user.id],
      lastMessage,
      unreadCount: index < 3 ? Math.floor(Math.random() * 4) : 0,
      updatedAt: lastMessage?.createdAt || new Date(),
      otherUser: user,
      isOnline: index < 3, // First 3 are online
    }
  })
}

export default function MessagingPage() {
  const [mounted, setMounted] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<ConversationId | undefined>()
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate conversations after mount to avoid hydration mismatch
  const conversations = useMemo(() => {
    if (!mounted) return []
    return generateConversations(users)
  }, [mounted])

  // Initialize messages for conversations
  useEffect(() => {
    if (mounted && conversations.length > 0) {
      const messagesMap: Record<string, Message[]> = {}
      conversations.forEach((conv) => {
        messagesMap[conv.id] = generateMessages(conv.id, conv.otherUser, currentUser.id)
      })
      setConversationMessages(messagesMap)

      // Select first conversation by default
      if (!activeConversationId) {
        setActiveConversationId(conversations[0].id)
      }
    }
  }, [mounted, conversations, activeConversationId])

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const activeMessages = activeConversationId
    ? conversationMessages[activeConversationId] || []
    : []

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return

    const newMessage: Message = {
      id: createMessageId(`${activeConversationId}-msg-${Date.now()}`),
      conversationId: activeConversationId,
      senderId: currentUser.id,
      content,
      createdAt: new Date(),
      read: false,
    }

    setConversationMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        <Card className="h-[calc(100vh-2rem)] m-4 overflow-hidden">
          <div className="flex h-full">
            {/* Conversation list sidebar */}
            <div className="w-[350px] shrink-0">
              {mounted ? (
                <ConversationList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={setActiveConversationId}
                />
              ) : (
                <div className="p-4 space-y-4">
                  <div className="h-8 bg-[var(--muted)] rounded animate-pulse" />
                  <div className="h-10 bg-[var(--muted)] rounded animate-pulse" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-12 w-12 rounded-full bg-[var(--muted)] animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--muted)] rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-[var(--muted)] rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active conversation view */}
            <div className="flex-1 border-l border-[var(--border)]">
              {mounted && activeConversation ? (
                <ConversationView
                  otherUser={activeConversation.otherUser}
                  messages={activeMessages}
                  currentUserId={currentUser.id}
                  isOnline={activeConversation.isOnline}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                  <MessageSquare className="h-16 w-16 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
                  <p className="text-sm">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
