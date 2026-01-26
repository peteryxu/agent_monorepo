"use client"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Skill, User } from "@/lib/types"
import { cn, getInitials } from "@/lib/utils"

interface SkillBadgeProps {
  skill: Skill
  endorsers?: User[]
  isOwnProfile?: boolean
  onEndorse?: () => void
  onAddSkill?: () => void
}

export function SkillBadge({
  skill,
  endorsers = [],
  isOwnProfile = false,
  onEndorse,
  onAddSkill,
}: SkillBadgeProps) {
  const topEndorsers = endorsers.slice(0, 3)

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-b-0">
      <div className="flex-1">
        <p className="font-medium text-sm text-[var(--foreground)]">{skill.name}</p>
        {skill.endorsements > 0 && (
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {skill.endorsements} endorsement{skill.endorsements !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {topEndorsers.length > 0 && (
          <div className="flex -space-x-2">
            {topEndorsers.map((endorser) => (
              <Avatar key={endorser.id} className="h-6 w-6 border-2 border-[var(--card)]">
                <AvatarImage src={endorser.avatar} alt={endorser.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(endorser.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
        {!isOwnProfile && onEndorse && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-[var(--primary)] hover:bg-[var(--linkedin-blue-light)]"
            onClick={onEndorse}
          >
            Endorse
          </Button>
        )}
      </div>
    </div>
  )
}

interface AddSkillBadgeProps {
  onAdd: () => void
}

export function AddSkillBadge({ onAdd }: AddSkillBadgeProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-auto py-3 text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--linkedin-blue-light)]"
      onClick={onAdd}
    >
      <Plus className="h-4 w-4" />
      Add skill
    </Button>
  )
}

interface SkillsSectionProps {
  skills: Skill[]
  endorsers?: Map<string, User[]>
  isOwnProfile?: boolean
  maxVisible?: number
}

export function SkillsSection({
  skills,
  endorsers = new Map(),
  isOwnProfile = false,
  maxVisible = 5,
}: SkillsSectionProps) {
  const visibleSkills = skills.slice(0, maxVisible)
  const remainingCount = skills.length - maxVisible

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Skills</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" className="text-[var(--primary)]">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {visibleSkills.map((skill) => (
            <SkillBadge
              key={skill.name}
              skill={skill}
              endorsers={endorsers.get(skill.name)}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
        {remainingCount > 0 && (
          <Button
            variant="link"
            className="w-full mt-2 text-[var(--primary)] font-semibold"
          >
            Show all {skills.length} skills
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
