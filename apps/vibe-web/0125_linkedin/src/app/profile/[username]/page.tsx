"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Link as LinkIcon,
  Pencil,
  Camera,
  UserPlus,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExperienceCard } from "@/components/profile/experience-card"
import { SkillBadge } from "@/components/profile/skill-badge"
import { PostCard } from "@/components/post/post-card"
import {
  currentUser,
  users,
  posts,
  generateExperiences,
  generateSkills,
} from "@/lib/mock-data"
import { formatCount, getInitials } from "@/lib/utils"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)

  // Find user
  const user =
    username.toLowerCase() === currentUser.firstName.toLowerCase()
      ? currentUser
      : users.find((u) => u.firstName.toLowerCase() === username.toLowerCase())

  if (!user) {
    notFound()
  }

  const isOwnProfile = user.id === currentUser.id
  const userPosts = posts.filter((p) => p.author.id === user.id).slice(0, 5)
  const experiences = generateExperiences(user)
  const skills = generateSkills(user)

  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-primary/30 to-primary/60">
          {user.coverImage && (
            <Image
              src={user.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CardContent className="relative pb-4">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-card">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-3xl">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              {user.isOpenToWork && (
                <div className="absolute bottom-0 inset-x-0 bg-success text-success-foreground text-[10px] font-semibold text-center py-0.5 rounded-b-full">
                  #OpenToWork
                </div>
              )}
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-2 right-0 h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            {isOwnProfile ? (
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Connect
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.isPremium && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  Premium
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-1">{user.headline}</p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.location}
              </span>
              <Link href="#" className="text-primary font-semibold hover:underline">
                {formatCount(user.connections)}+ connections
              </Link>
            </div>

            {user.currentCompany && (
              <div className="flex items-center gap-2 mt-3">
                <Image
                  src={user.currentCompany.logo}
                  alt={user.currentCompany.name}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="text-sm font-medium">{user.currentCompany.name}</span>
              </div>
            )}
          </div>

          {/* Analytics */}
          {isOwnProfile && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm mb-3">Analytics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{user.profileViews}</p>
                  <p className="text-xs text-muted-foreground">Profile views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCount(user.postImpressions)}</p>
                  <p className="text-xs text-muted-foreground">Post impressions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.searchAppearances}</p>
                  <p className="text-xs text-muted-foreground">Search appearances</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      {user.about && (
        <Card className="mt-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>About</CardTitle>
            {isOwnProfile && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{user.about}</p>
          </CardContent>
        </Card>
      )}

      {/* Activity */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatCount(user.followers)} followers
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 mb-4">
              <TabsTrigger
                value="posts"
                className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Images
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-2">
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No posts yet
                </p>
              )}
            </TabsContent>
            <TabsContent value="comments">
              <p className="text-sm text-muted-foreground text-center py-8">
                No comments yet
              </p>
            </TabsContent>
            <TabsContent value="images">
              <p className="text-sm text-muted-foreground text-center py-8">
                No images yet
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Experience */}
      <div className="mt-2">
        <ExperienceCard experiences={experiences} isOwnProfile={isOwnProfile} />
      </div>

      {/* Skills */}
      <div className="mt-2">
        <SkillBadge skills={skills} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  )
}
