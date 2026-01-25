"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Grid3X3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/lib/mock-data"
import { formatCount, getInitials } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/connections", icon: Users, label: "My Network" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/messaging", icon: MessageSquare, label: "Messaging" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-16 hidden lg:block w-[225px] shrink-0">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Cover */}
        <div className="h-14 bg-gradient-to-r from-primary/20 to-primary/40" />

        {/* Profile info */}
        <div className="px-4 pb-4">
          <Link href={`/profile/${currentUser.firstName.toLowerCase()}`} className="-mt-8 block">
            <Avatar className="h-16 w-16 border-2 border-card">
              <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
              <AvatarFallback>
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <Link
            href={`/profile/${currentUser.firstName.toLowerCase()}`}
            className="mt-2 block hover:underline"
          >
            <h3 className="font-semibold text-sm">
              {currentUser.firstName} {currentUser.lastName}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {currentUser.headline}
          </p>
        </div>

        <Separator />

        {/* Stats */}
        <Link
          href={`/profile/${currentUser.firstName.toLowerCase()}`}
          className="block px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Profile viewers</span>
            <span className="text-primary font-semibold">{currentUser.profileViews}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-muted-foreground">Post impressions</span>
            <span className="text-primary font-semibold">{formatCount(currentUser.postImpressions)}</span>
          </div>
        </Link>

        <Separator />

        {/* Premium */}
        {currentUser.isPremium && (
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Access exclusive tools & insights
            </p>
            <p className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-1">
              <span className="inline-block w-4 h-4 bg-amber-500 rounded-sm" />
              Premium member
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <Card className="mt-2 py-2">
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "text-foreground font-semibold border-l-2 border-primary bg-muted/50"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </Card>

      {/* Quick links */}
      <Card className="mt-2 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recent</h4>
        <div className="space-y-2">
          <Link
            href="/groups/react-developers"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <Grid3X3 className="h-4 w-4" />
            React Developers
          </Link>
          <Link
            href="/groups/startup-founders"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <Grid3X3 className="h-4 w-4" />
            Startup Founders
          </Link>
        </div>
      </Card>
    </aside>
  )
}
