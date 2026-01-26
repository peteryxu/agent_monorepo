"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  UserPlus,
  MessageSquare,
  Briefcase,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/types"
import { cn, formatCount, getInitials } from "@/lib/utils"

interface ProfileHeaderProps {
  user: User
  isOwnProfile?: boolean
  isConnected?: boolean
  isPending?: boolean
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
  isConnected = false,
  isPending = false,
}: ProfileHeaderProps) {
  const [connectionState, setConnectionState] = useState<"none" | "pending" | "connected">(
    isConnected ? "connected" : isPending ? "pending" : "none"
  )

  const handleConnect = () => {
    if (connectionState === "none") {
      setConnectionState("pending")
    }
  }

  const handleWithdraw = () => {
    setConnectionState("none")
  }

  return (
    <Card className="overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-[200px] sm:h-[300px] bg-gradient-to-br from-[var(--linkedin-blue)] via-[var(--linkedin-blue-hover)] to-[var(--primary)]">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <CardContent className="relative pt-0 px-4 sm:px-6 pb-6">
        {/* Avatar - positioned overlapping cover */}
        <div className="relative -mt-[75px] sm:-mt-[90px] mb-4">
          <Avatar className="h-[150px] w-[150px] border-4 border-[var(--card)] shadow-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-4xl font-semibold bg-[var(--muted)]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Name and Pronouns */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                {user.name}
              </h1>
              {user.pronouns && (
                <span className="text-sm text-[var(--muted-foreground)]">
                  ({user.pronouns})
                </span>
              )}
            </div>

            {/* Headline */}
            <p className="text-base text-[var(--foreground)] mt-1">
              {user.headline}
            </p>

            {/* Location & Contact */}
            <div className="flex items-center gap-2 mt-2 text-sm text-[var(--muted-foreground)]">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{user.location}</span>
              {user.website && (
                <>
                  <span className="mx-1">&middot;</span>
                  <Link
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Contact info
                  </Link>
                </>
              )}
            </div>

            {/* Connections & Followers */}
            <div className="flex items-center gap-4 mt-3">
              <Link
                href="#connections"
                className="text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                {formatCount(user.connections)} connections
              </Link>
              <span className="text-sm text-[var(--muted-foreground)]">
                {formatCount(user.followers)} followers
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {user.isOpenToWork && (
                <Badge
                  variant="outline"
                  className="border-[var(--linkedin-green)] text-[var(--linkedin-green)] bg-green-50 dark:bg-green-950/30"
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  Open to work
                </Badge>
              )}
              {user.isHiring && (
                <Badge
                  variant="outline"
                  className="border-[var(--primary)] text-[var(--primary)] bg-blue-50 dark:bg-blue-950/30"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Hiring
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {isOwnProfile ? (
              <>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Add profile section
                </Button>
                <Button variant="default" className="flex-1 sm:flex-none">
                  Open to
                </Button>
              </>
            ) : (
              <>
                {connectionState === "none" && (
                  <Button
                    variant="default"
                    className="flex-1 sm:flex-none"
                    onClick={handleConnect}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
                {connectionState === "pending" && (
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={handleWithdraw}
                  >
                    Pending
                  </Button>
                )}
                {connectionState === "connected" && (
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}
                {connectionState !== "connected" && (
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}

                {/* More Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Send profile in a message</DropdownMenuItem>
                    <DropdownMenuItem>Save to PDF</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Follow</DropdownMenuItem>
                    <DropdownMenuItem>Recommend</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-[var(--destructive)]">
                      Report / Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
