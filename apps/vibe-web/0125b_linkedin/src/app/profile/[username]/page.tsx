import { notFound } from "next/navigation"
import { ProfileContent } from "@/components/profile/profile-content"
import { users, usersById } from "@/lib/mock-data"
import type { UserId } from "@/lib/types"

// Generate static params for all users
export function generateStaticParams() {
  return users.map((user) => ({
    username: user.id,
  }))
}

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  // Find user by ID (username in our case is the user ID)
  const user = usersById.get(username as UserId)

  // Handle user not found
  if (!user) {
    notFound()
  }

  return <ProfileContent user={user} />
}
