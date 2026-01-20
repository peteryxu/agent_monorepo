"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import type { User } from "@/lib/types"

interface ConnectionCardProps {
  user: User
  type: "suggestion" | "pending" | "connected"
}

export function ConnectionCard({ user, type }: ConnectionCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <Link
          href={`/profile/${user.username}`}
          className="mt-3 font-semibold hover:text-primary hover:underline"
        >
          {user.name}
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {user.headline}
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          {user.connections} connections
        </p>

        <div className="mt-4 w-full">
          {type === "suggestion" && (
            <Button className="w-full rounded-full" variant="outline">
              Connect
            </Button>
          )}
          {type === "pending" && (
            <div className="flex gap-2">
              <Button className="flex-1 rounded-full" size="sm">
                Accept
              </Button>
              <Button className="flex-1 rounded-full" variant="outline" size="sm">
                Ignore
              </Button>
            </div>
          )}
          {type === "connected" && (
            <Button className="w-full rounded-full" variant="outline">
              Message
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
