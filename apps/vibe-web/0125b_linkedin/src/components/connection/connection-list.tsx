"use client"

import { useState, useMemo } from "react"
import { Search, Grid3X3, List, MessageSquare, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/types"

type SortOption = "recent" | "first-name" | "last-name"
type ViewMode = "grid" | "list"

interface ConnectionListProps {
  connections: User[]
  onMessage?: (user: User) => void
}

export function ConnectionList({ connections, onMessage }: ConnectionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const filteredAndSortedConnections = useMemo(() => {
    let result = [...connections]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.headline.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "first-name":
          return a.name.split(" ")[0].localeCompare(b.name.split(" ")[0])
        case "last-name":
          const aLast = a.name.split(" ").slice(-1)[0]
          const bLast = b.name.split(" ").slice(-1)[0]
          return aLast.localeCompare(bLast)
        case "recent":
        default:
          // Keep original order (most recent first from mock data)
          return 0
      }
    })

    return result
  }, [connections, searchQuery, sortBy])

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recently added" },
    { value: "first-name", label: "First name" },
    { value: "last-name", label: "Last name" },
  ]

  return (
    <div className="space-y-4">
      {/* Search and filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View mode toggle */}
        <div className="flex border border-[var(--border)] rounded-md overflow-hidden shrink-0">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list"
                ? "bg-[var(--muted)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid"
                ? "bg-[var(--muted)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--muted-foreground)]">
        {filteredAndSortedConnections.length} connection
        {filteredAndSortedConnections.length !== 1 ? "s" : ""}
      </p>

      {/* Connection list/grid */}
      {viewMode === "list" ? (
        <div className="space-y-2">
          {filteredAndSortedConnections.map((user) => (
            <ConnectionListItem key={user.id} user={user} onMessage={onMessage} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedConnections.map((user) => (
            <ConnectionGridItem key={user.id} user={user} onMessage={onMessage} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredAndSortedConnections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">No connections found</p>
        </div>
      )}
    </div>
  )
}

// List view item
function ConnectionListItem({
  user,
  onMessage,
}: {
  user: User
  onMessage?: (user: User) => void
}) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{user.name}</h4>
          <p className="text-xs text-[var(--muted-foreground)] truncate">
            {user.headline}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
            {user.connections} connections
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(user)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Remove connection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}

// Grid view item
function ConnectionGridItem({
  user,
  onMessage,
}: {
  user: User
  onMessage?: (user: User) => void
}) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <h4 className="font-semibold text-sm mt-3 truncate w-full">{user.name}</h4>
        <p className="text-xs text-[var(--muted-foreground)] truncate w-full">
          {user.headline}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => onMessage?.(user)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
      </div>
    </Card>
  )
}
