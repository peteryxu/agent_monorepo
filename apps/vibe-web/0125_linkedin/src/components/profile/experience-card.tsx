"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { formatDateRange, formatDuration } from "@/lib/utils"
import type { Experience } from "@/lib/types"

interface ExperienceCardProps {
  experiences: Experience[]
  isOwnProfile?: boolean
}

export function ExperienceCard({ experiences, isOwnProfile = false }: ExperienceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        {isOwnProfile && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="flex gap-3">
            <div className="shrink-0">
              <Image
                src={exp.company.logo}
                alt={exp.company.name}
                width={48}
                height={48}
                className="rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">{exp.company.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateRange(exp.startDate, exp.endDate)} · {formatDuration(exp.startDate, exp.endDate)}
              </p>
              <p className="text-xs text-muted-foreground">{exp.location}</p>
              {exp.description && (
                <p className="text-sm mt-2 line-clamp-3">{exp.description}</p>
              )}
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="text-xs text-primary font-medium">
                      {skill} ·
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
