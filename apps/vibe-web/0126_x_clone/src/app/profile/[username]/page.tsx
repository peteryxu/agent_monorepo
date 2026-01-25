"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { TweetCard } from "@/components/tweet/tweet-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { currentUser, users, tweets } from "@/lib/mock-data"
import { formatCount } from "@/lib/utils"
import { toast } from "sonner"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const [isFollowing, setIsFollowing] = useState(false)

  // Find user by username
  const user =
    username === currentUser.username
      ? currentUser
      : users.find((u) => u.username === username)

  if (!user) {
    notFound()
  }

  const isOwnProfile = user.id === currentUser.id

  // Get user's tweets
  const userTweets = tweets.filter((t) => t.author.id === user.id)
  const userReplies = tweets.filter(
    (t) => t.author.id === user.id && t.replyTo
  )
  const userLikes = tweets.filter((t) => t.isLiked).slice(0, 20)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? `Unfollowed @${user.username}` : `Following @${user.username}`)
  }

  const handleEditProfile = () => {
    toast.info("Edit profile coming soon")
  }

  const joinedDate = new Date(user.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[275px] shrink-0 border-r border-border">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[600px] border-r border-border">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border flex items-center gap-6 px-4 py-2">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">
                {formatCount(userTweets.length)} posts
              </p>
            </div>
          </header>

          {/* Banner */}
          <div className="h-48 bg-muted relative">
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"
              style={{
                backgroundImage: `url(https://picsum.photos/seed/${user.id}/600/200)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Profile info */}
          <div className="px-4 pb-4 relative">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-background -mt-16 relative">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
            </Avatar>

            {/* Edit/Follow button */}
            <div className="absolute right-4 top-4">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  className="rounded-full font-bold"
                  onClick={handleEditProfile}
                >
                  Edit profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="rounded-full font-bold"
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>

            {/* Name and username */}
            <div className="mt-3">
              <h2 className="text-xl font-bold flex items-center gap-1">
                {user.name}
                {user.verified && (
                  <svg
                    viewBox="0 0 22 22"
                    className="h-5 w-5 fill-primary"
                    aria-label="Verified account"
                  >
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </svg>
                )}
              </h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {/* Bio */}
            {user.bio && <p className="mt-3">{user.bio}</p>}

            {/* Details */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
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
                Joined {joinedDate}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-3">
              <Link
                href={`/profile/${user.username}/following`}
                className="hover:underline"
              >
                <span className="font-bold">{formatCount(user.following)}</span>{" "}
                <span className="text-muted-foreground">Following</span>
              </Link>
              <Link
                href={`/profile/${user.username}/followers`}
                className="hover:underline"
              >
                <span className="font-bold">{formatCount(user.followers)}</span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
              <TabsTrigger
                value="posts"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="replies"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4"
              >
                Likes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              {userTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
              {userTweets.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No posts yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="replies" className="mt-0">
              {userReplies.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
              {userReplies.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No replies yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <div className="grid grid-cols-3 gap-1">
                {userTweets
                  .filter((t) => t.images && t.images.length > 0)
                  .flatMap((t) => t.images || [])
                  .slice(0, 12)
                  .map((image, i) => (
                    <div key={i} className="aspect-square relative overflow-hidden">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              {userLikes.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
              {userLikes.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No likes yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
