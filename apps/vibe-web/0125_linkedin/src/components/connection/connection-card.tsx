"use client"

import Link from "next/link"
import { X, UserPlus, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { Connection } from "@/lib/types"
import { toast } from "sonner"

interface ConnectionCardProps {
  connection: Connection
  variant?: "request" | "suggestion" | "connected"
}

export function ConnectionCard({ connection, variant = "connected" }: ConnectionCardProps) {
  const { user, mutualConnections } = connection

  const handleAccept = () => {
    toast.success(`Connected with ${user.firstName}`)
  }

  const handleIgnore = () => {
    toast.success("Request ignored")
  }

  const handleConnect = () => {
    toast.success(`Connection request sent to ${user.firstName}`)
  }

  if (variant === "request") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Link href={`/profile/${user.firstName.toLowerCase()}`}>
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${user.firstName.toLowerCase()}`}
                className="font-semibold text-sm hover:underline block truncate"
              >
                {user.firstName} {user.lastName}
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {user.headline}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {mutualConnections} mutual connection{mutualConnections !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleAccept}>
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={handleIgnore}>
                  Ignore
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "suggestion") {
    return (
      <Card className="relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-4 pt-8 text-center">
          <Link href={`/profile/${user.firstName.toLowerCase()}`}>
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link
            href={`/profile/${user.firstName.toLowerCase()}`}
            className="font-semibold text-sm hover:underline block mt-3"
          >
            {user.firstName} {user.lastName}
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {user.headline}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {mutualConnections} mutual connection{mutualConnections !== 1 ? "s" : ""}
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={handleConnect}>
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Connected variant
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Link href={`/profile/${user.firstName.toLowerCase()}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${user.firstName.toLowerCase()}`}
          className="font-semibold text-sm hover:underline block truncate"
        >
          {user.firstName} {user.lastName}
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {user.headline}
        </p>
      </div>
      <Button variant="outline" size="sm">
        <MessageSquare className="mr-2 h-4 w-4" />
        Message
      </Button>
    </div>
  )
}
