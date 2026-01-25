"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ChevronRight } from "lucide-react"
import { getInitials } from "@/lib/utils"
import type { Skill } from "@/lib/types"

interface SkillBadgeProps {
  skills: Skill[]
  isOwnProfile?: boolean
}

export function SkillBadge({ skills, isOwnProfile = false }: SkillBadgeProps) {
  const topSkills = skills.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {topSkills.map((skill) => (
          <div key={skill.name} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">{skill.name}</h3>
              {skill.endorsements > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-2">
                    {skill.endorsedBy.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="h-5 w-5 border border-background">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {skill.endorsements} endorsement{skill.endorsements !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Endorse
              </Button>
            )}
          </div>
        ))}

        {skills.length > 5 && (
          <Button variant="ghost" className="w-full justify-between text-muted-foreground">
            Show all {skills.length} skills
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
