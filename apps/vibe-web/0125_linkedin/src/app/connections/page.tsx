"use client"

import { Users, UserPlus, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectionCard } from "@/components/connection/connection-card"
import { connections, pendingRequests, suggestedConnections, currentUser } from "@/lib/mock-data"

export default function ConnectionsPage() {
  const connectedUsers = connections.filter((c) => c.status === "connected")

  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[225px] shrink-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Manage my network</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="py-2">
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50">
                  <span className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Connections
                  </span>
                  <span className="text-muted-foreground">{currentUser.connections}</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50">
                  <span className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5" />
                    Pending
                  </span>
                  <span className="text-muted-foreground">{pendingRequests.length}</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Pending requests */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  Invitations ({pendingRequests.length})
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  Manage
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((request) => (
                  <ConnectionCard
                    key={request.id}
                    connection={request}
                    variant="request"
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* People you may know */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">People you may know</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedConnections.slice(0, 6).map((connection) => (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    variant="suggestion"
                  />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary">
                Show more
              </Button>
            </CardContent>
          </Card>

          {/* My connections */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {connectedUsers.length} Connections
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search connections"
                  className="pl-9 h-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {connectedUsers.map((connection) => (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    variant="connected"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
