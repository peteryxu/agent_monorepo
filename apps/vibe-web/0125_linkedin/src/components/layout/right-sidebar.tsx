"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Info } from "lucide-react"
import { news, suggestedConnections } from "@/lib/mock-data"
import { formatCount, getInitials } from "@/lib/utils"

export function RightSidebar() {
  return (
    <aside className="sticky top-16 hidden xl:block w-[300px] shrink-0 space-y-2">
      {/* LinkedIn News */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            LinkedIn News
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3">
            {news.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link
                  href="#"
                  className="group block"
                >
                  <h4 className="text-sm font-medium group-hover:text-primary line-clamp-2">
                    • {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.timeAgo} • {formatCount(item.readers)} readers
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-start text-muted-foreground">
            Show more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* People you may know */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">People you may know</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {suggestedConnections.slice(0, 3).map((connection) => (
            <div key={connection.id} className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={connection.user.avatar} />
                <AvatarFallback>
                  {getInitials(connection.user.firstName, connection.user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${connection.user.firstName.toLowerCase()}`}
                  className="font-medium text-sm hover:underline block truncate"
                >
                  {connection.user.firstName} {connection.user.lastName}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {connection.user.headline}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {connection.mutualConnections} mutual connection{connection.mutualConnections !== 1 ? "s" : ""}
                </p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
                  Connect
                </Button>
              </div>
            </div>
          ))}
          <Separator />
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            Show more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Footer links */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary hover:underline">About</Link>
          <Link href="#" className="hover:text-primary hover:underline">Accessibility</Link>
          <Link href="#" className="hover:text-primary hover:underline">Help Center</Link>
          <Link href="#" className="hover:text-primary hover:underline">Privacy & Terms</Link>
          <Link href="#" className="hover:text-primary hover:underline">Ad Choices</Link>
          <Link href="#" className="hover:text-primary hover:underline">Advertising</Link>
          <Link href="#" className="hover:text-primary hover:underline">Business Services</Link>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          LinkedIn Clone © 2025
        </p>
      </div>
    </aside>
  )
}
