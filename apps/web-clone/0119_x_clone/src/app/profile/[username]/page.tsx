"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserByUsername, getTweetsByUser, currentUser } from "@/lib/mock-data"
import { formatCount, cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/tweet/verified-badge"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const user = getUserByUsername(username)
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing ?? false)

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="flex w-full max-w-[1265px]">
          <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
            <div className="px-4 py-16 text-center">
              <h1 className="font-bold text-3xl">This account doesn't exist</h1>
              <p className="text-muted-foreground mt-2">
                Try searching for another.
              </p>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  const userTweets = getTweetsByUser(user.id)
  const isOwnProfile = user.id === currentUser.id

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex w-full max-w-[1265px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-x border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
            <div className="flex items-center gap-6 px-4 py-2">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-bold text-xl flex items-center gap-1">
                  {user.name}
                  {user.verified && <VerifiedBadge />}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {userTweets.length} posts
                </p>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="h-48 bg-muted relative">
            <Image
              src={`https://picsum.photos/seed/${user.username}/600/200`}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>

          {/* Profile info */}
          <div className="px-4 pb-4 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-4">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-4xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Edit/Follow button */}
            <div className="flex justify-end pt-3">
              {isOwnProfile ? (
                <Button variant="outline" className="rounded-full font-bold">
                  Edit profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="rounded-full font-bold"
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>

            {/* Name and username */}
            <div className="mt-12">
              <h2 className="font-bold text-xl flex items-center gap-1">
                {user.name}
                {user.verified && <VerifiedBadge />}
              </h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {/* Bio */}
            <p className="mt-3">{user.bio}</p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-muted-foreground text-sm">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {user.joinedAt.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Following/Followers */}
            <div className="flex gap-4 mt-3">
              <Link href="#" className="hover:underline">
                <span className="font-bold">{formatCount(user.following)}</span>{" "}
                <span className="text-muted-foreground">Following</span>
              </Link>
              <Link href="#" className="hover:underline">
                <span className="font-bold">{formatCount(user.followers)}</span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border rounded-none">
              <TabsTrigger
                value="posts"
                className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative data-[state=active]:font-bold"
              >
                Posts
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full hidden data-[state=active]:block" />
              </TabsTrigger>
              <TabsTrigger
                value="replies"
                className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative data-[state=active]:font-bold"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative data-[state=active]:font-bold"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="flex-1 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none relative data-[state=active]:font-bold"
              >
                Likes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              {userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  @{user.username} hasn't posted yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="replies" className="mt-0">
              <div className="px-4 py-8 text-center text-muted-foreground">
                No replies yet
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <div className="grid grid-cols-3 gap-0.5">
                {userTweets
                  .filter((t) => t.images && t.images.length > 0)
                  .flatMap((t) => t.images!)
                  .slice(0, 9)
                  .map((image, i) => (
                    <div key={i} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`Media ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
              {userTweets.filter((t) => t.images).length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No media yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              <div className="px-4 py-8 text-center text-muted-foreground">
                No likes yet
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[350px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
