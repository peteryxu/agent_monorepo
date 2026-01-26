"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/profile/profile-header"
import { AboutSection } from "@/components/profile/about-section"
import { ExperienceSection } from "@/components/profile/experience-card"
import { EducationSection } from "@/components/profile/education-card"
import { SkillsSection } from "@/components/profile/skill-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { posts, currentUser } from "@/lib/mock-data"
import type { User } from "@/lib/types"

// Mock posts section for the profile
function PostsSection({ userId }: { userId: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter posts by this user
  const userPosts = posts.filter((post) => post.authorId === userId)

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-[var(--muted)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activity</CardTitle>
        <p className="text-sm text-[var(--muted-foreground)]">
          {userPosts.length} posts
        </p>
      </CardHeader>
      <CardContent>
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer"
              >
                <p className="text-sm text-[var(--foreground)] line-clamp-3">
                  {post.type === "text" && post.content}
                  {post.type === "article" && post.title}
                  {post.type === "poll" && post.question}
                  {post.type === "celebration" && post.content}
                  {post.type === "job-share" && (post.caption || "Shared a job posting")}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
                  <span>{post.totalReactions} reactions</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            No posts yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface ProfileContentProps {
  user: User
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isOwnProfile = user.id === currentUser.id

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-[300px] bg-[var(--muted)] rounded-lg" />
            <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
            <div className="h-4 bg-[var(--muted)] rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isConnected={false}
          isPending={false}
        />

        {/* Profile Content with Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start bg-[var(--card)] border border-[var(--border)] rounded-lg p-1 h-auto flex-wrap">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)]"
            >
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <PostsSection userId={user.id} />
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            {user.about ? (
              <AboutSection about={user.about} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-[var(--muted-foreground)]">
                    {isOwnProfile
                      ? "Add an about section to tell others about yourself."
                      : "No about section available."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="experience" className="mt-4">
            <ExperienceSection
              experience={user.experience}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-4">
            <EducationSection
              education={user.education}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <SkillsSection
              skills={user.skills}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
