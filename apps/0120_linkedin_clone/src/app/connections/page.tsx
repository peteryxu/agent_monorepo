"use client"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ConnectionCard } from "@/components/connection/connection-card"
import { users, getPendingConnections, getConnectionSuggestions } from "@/lib/mock-data"

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const connectedUsers = users.filter((u) => u.connectionStatus === "connected")
  const pendingUsers = getPendingConnections()
  const suggestedUsers = getConnectionSuggestions()

  const filteredConnections = connectedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-4 space-y-4 pb-24 md:pb-4">
          {/* Manage network header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Manage my network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="connections" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="connections">
                    Connections ({connectedUsers.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingUsers.length})
                  </TabsTrigger>
                  <TabsTrigger value="suggestions">
                    Suggestions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="connections" className="mt-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search connections"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {filteredConnections.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredConnections.map((user) => (
                        <ConnectionCard
                          key={user.id}
                          user={user}
                          type="connected"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery
                        ? "No connections found matching your search"
                        : "No connections yet"}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  {pendingUsers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pendingUsers.map((user) => (
                        <ConnectionCard
                          key={user.id}
                          user={user}
                          type="pending"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending invitations
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {suggestedUsers.map((user) => (
                      <ConnectionCard
                        key={user.id}
                        user={user}
                        type="suggestion"
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* People you may know */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">People you may know</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.slice(0, 8).map((user) => (
                  <ConnectionCard
                    key={user.id}
                    user={user}
                    type="suggestion"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
