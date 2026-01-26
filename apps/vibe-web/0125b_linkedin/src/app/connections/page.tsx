"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp, Users, UserPlus, Sparkles, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectionCard } from "@/components/connection/connection-card"
import { PendingInvitation } from "@/components/connection/pending-invitation"
import { ConnectionList } from "@/components/connection/connection-list"
import { users, currentUser } from "@/lib/mock-data"
import type { User } from "@/lib/types"

// Generate mock pending invitations
function generatePendingInvitations(allUsers: User[], count: number) {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)
  return otherUsers.slice(0, count).map((user, index) => ({
    user,
    mutualConnections: Math.floor(Math.random() * 15) + 1,
    receivedAt: new Date(Date.now() - (index * 24 + Math.random() * 24) * 60 * 60 * 1000),
    message: index % 3 === 0
      ? "Hi! I'd love to connect and learn more about your work in the industry."
      : undefined,
  }))
}

// Generate connection suggestions
function generateSuggestions(allUsers: User[], count: number) {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)
  return otherUsers.slice(5, 5 + count).map((user) => ({
    user,
    mutualConnections: Math.floor(Math.random() * 20) + 1,
  }))
}

// Generate existing connections
function generateConnections(allUsers: User[]) {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)
  return otherUsers.slice(8)
}

export default function ConnectionsPage() {
  const [mounted, setMounted] = useState(false)
  const [invitationsExpanded, setInvitationsExpanded] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate mock data after mounting to avoid hydration mismatch
  const { pendingInvitations, suggestions, connections } = useMemo(() => {
    if (!mounted) {
      return { pendingInvitations: [], suggestions: [], connections: [] }
    }
    return {
      pendingInvitations: generatePendingInvitations(users, 5),
      suggestions: generateSuggestions(users, 9),
      connections: generateConnections(users),
    }
  }, [mounted])

  const connectionCount = connections.length
  const pendingCount = pendingInvitations.length

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">My Network</h1>
        </div>

        {/* Stats bar */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--primary)]" />
                <span className="font-semibold">{connectionCount}</span>
                <span className="text-[var(--muted-foreground)]">connections</span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[var(--primary)]" />
                <span className="font-semibold">{pendingCount}</span>
                <span className="text-[var(--muted-foreground)]">pending invitations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="grow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grow" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Grow
            </TabsTrigger>
            <TabsTrigger value="catch-up" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Catch up
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connections
            </TabsTrigger>
          </TabsList>

          {/* Grow Tab */}
          <TabsContent value="grow" className="space-y-6">
            {/* Pending invitations section */}
            {mounted && pendingInvitations.length > 0 && (
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setInvitationsExpanded(!invitationsExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Invitations ({pendingInvitations.length})
                    </CardTitle>
                    {invitationsExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[var(--muted-foreground)]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </CardHeader>
                {invitationsExpanded && (
                  <CardContent className="pt-0 px-0">
                    <div className="divide-y divide-[var(--border)]">
                      {pendingInvitations.map((invitation, index) => (
                        <PendingInvitation
                          key={invitation.user.id}
                          user={invitation.user}
                          mutualConnections={invitation.mutualConnections}
                          receivedAt={invitation.receivedAt}
                          message={invitation.message}
                        />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* People you may know */}
            <div>
              <h2 className="text-lg font-semibold mb-4">People you may know</h2>
              {mounted ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion) => (
                    <ConnectionCard
                      key={suggestion.user.id}
                      user={suggestion.user}
                      mutualConnections={suggestion.mutualConnections}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-[220px] animate-pulse bg-[var(--muted)]" />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Catch up Tab */}
          <TabsContent value="catch-up">
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stay in touch with your network</h3>
                <p className="text-[var(--muted-foreground)]">
                  See updates from your connections and celebrate their milestones.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            {mounted ? (
              <ConnectionList connections={connections} />
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="h-[88px] animate-pulse bg-[var(--muted)]" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
