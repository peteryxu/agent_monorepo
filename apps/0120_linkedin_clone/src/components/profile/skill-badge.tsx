"use client"

import { Progress } from "@/components/ui/progress"
import type { Skill } from "@/lib/types"

interface SkillBadgeProps {
  skill: Skill
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  const maxEndorsements = 99
  const percentage = Math.min((skill.endorsements / maxEndorsements) * 100, 100)

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{skill.name}</p>
        <p className="text-sm text-muted-foreground">
          {skill.endorsements} endorsement{skill.endorsements !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="w-24">
        <Progress value={percentage} className="h-1.5" />
      </div>
    </div>
  )
}
