"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Experience } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | "Self-employed"

interface ExperienceCardProps {
  experience: Experience
  employmentType?: EmploymentType
  maxDescriptionLength?: number
}

export function ExperienceCard({
  experience,
  employmentType = "Full-time",
  maxDescriptionLength = 200,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const description = experience.description || ""
  const shouldTruncate = description.length > maxDescriptionLength

  const displayDescription = shouldTruncate && !isExpanded
    ? description.slice(0, maxDescriptionLength).trim()
    : description

  const dateRange = formatDuration(experience.startDate, experience.endDate || undefined)

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--border)] last:border-b-0">
      {/* Company Logo */}
      <div className="flex-shrink-0">
        {experience.companyLogo ? (
          <Image
            src={experience.companyLogo}
            alt={experience.companyName}
            width={48}
            height={48}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-[var(--muted)] flex items-center justify-center">
            <span className="text-lg font-semibold text-[var(--muted-foreground)]">
              {experience.companyName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Experience Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--foreground)] text-sm">
          {experience.title}
        </h3>

        <p className="text-sm text-[var(--foreground)] mt-0.5">
          {experience.companyId ? (
            <Link
              href={`/company/${experience.companyId}`}
              className="hover:text-[var(--primary)] hover:underline"
            >
              {experience.companyName}
            </Link>
          ) : (
            experience.companyName
          )}
          {" "}&middot; {employmentType}
        </p>

        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          {dateRange}
        </p>

        {experience.location && (
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {experience.location}
          </p>
        )}

        {description && (
          <div className="mt-3">
            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
              {displayDescription}
              {shouldTruncate && !isExpanded && "..."}
            </p>
            {shouldTruncate && (
              <Button
                variant="link"
                className="p-0 h-auto mt-1 text-[var(--primary)] font-semibold text-sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "...see less" : "...see more"}
              </Button>
            )}
          </div>
        )}

        {/* Skills */}
        {experience.skills && experience.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {experience.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ExperienceSectionProps {
  experience: Experience[]
  isOwnProfile?: boolean
}

export function ExperienceSection({ experience, isOwnProfile = false }: ExperienceSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Experience</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" className="text-[var(--primary)]">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {experience.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
        {experience.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)] py-4">
            No work experience added yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
