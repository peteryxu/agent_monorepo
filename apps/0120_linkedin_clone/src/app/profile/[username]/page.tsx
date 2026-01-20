"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, LinkIcon, Pencil, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PostCard } from "@/components/post/post-card"
import { ExperienceCard } from "@/components/profile/experience-card"
import { SkillBadge } from "@/components/profile/skill-badge"
import { getUserByUsername, getPostsByUser, currentUser } from "@/lib/mock-data"
import { getInitials, formatCount } from "@/lib/utils"

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = use(params)
  const user = getUserByUsername(username)

  if (!user) {
    notFound()
  }

  const userPosts = getPostsByUser(user.id)
  const isOwnProfile = user.id === currentUser.id

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-[800px] px-4 py-4 space-y-4 pb-24 md:pb-4">
          {/* Profile header card */}
          <Card className="overflow-hidden">
            {/* Cover image */}
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
              <Image
                src={user.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            <CardContent className="relative pt-0">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <Avatar className="h-32 w-32 border-4 border-card">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end pt-4 gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" className="rounded-full">
                      Add profile section
                    </Button>
                    <Button className="rounded-full">
                      Open to
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="rounded-full">
                      {user.connectionStatus === "connected"
                        ? "Message"
                        : user.connectionStatus === "pending-sent"
                        ? "Pending"
                        : "Connect"}
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      More
                    </Button>
                  </>
                )}
              </div>

              {/* User info */}
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.isPremium && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-lg">{user.headline}</p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <Link
                      href={user.website}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Contact info
                    </Link>
                  )}
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                  <Link href="#" className="text-primary font-semibold hover:underline">
                    {formatCount(user.connections)} connections
                  </Link>
                  <span className="text-muted-foreground">
                    {formatCount(user.followers)} followers
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          {user.about && (
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>About</CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{user.about}</p>
              </CardContent>
            </Card>
          )}

          {/* Activity / Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatCount(user.followers)} followers
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="posts">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-4 space-y-2">
                  {userPosts.slice(0, 3).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {userPosts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No posts yet
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="comments" className="mt-4">
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet
                  </p>
                </TabsContent>
                <TabsContent value="images" className="mt-4">
                  <p className="text-center text-muted-foreground py-8">
                    No images yet
                  </p>
                </TabsContent>
                <TabsContent value="videos" className="mt-4">
                  <p className="text-center text-muted-foreground py-8">
                    No videos yet
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Experience</CardTitle>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="divide-y">
              {user.experience.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="divide-y">
              {user.education.map((edu) => (
                <div key={edu.id} className="flex gap-4 py-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    {edu.logo ? (
                      <Image
                        src={edu.logo}
                        alt={edu.school}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-lg font-bold">{edu.school[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-sm">
                      {edu.degree}, {edu.field}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate.getFullYear()} - {edu.endDate?.getFullYear() || "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {user.skills.slice(0, 5).map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
              {user.skills.length > 5 && (
                <Button variant="ghost" className="w-full mt-2">
                  Show all {user.skills.length} skills
                </Button>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex w-[300px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
