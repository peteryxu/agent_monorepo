import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Education } from "@/lib/types"

interface EducationCardProps {
  education: Education
}

export function EducationCard({ education }: EducationCardProps) {
  const dateRange = education.endYear
    ? `${education.startYear} - ${education.endYear}`
    : `${education.startYear} - Present`

  const degreeInfo = [education.degree, education.fieldOfStudy]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--border)] last:border-b-0">
      {/* School Logo */}
      <div className="flex-shrink-0">
        {education.logo ? (
          <Image
            src={education.logo}
            alt={education.school}
            width={48}
            height={48}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-[var(--muted)] flex items-center justify-center">
            <span className="text-lg font-semibold text-[var(--muted-foreground)]">
              {education.school.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Education Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--foreground)] text-sm">
          {education.school}
        </h3>

        {degreeInfo && (
          <p className="text-sm text-[var(--foreground)] mt-0.5">
            {degreeInfo}
          </p>
        )}

        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          {dateRange}
        </p>

        {education.activities && (
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            <span className="font-medium">Activities and societies:</span>{" "}
            {education.activities}
          </p>
        )}

        {education.description && (
          <p className="text-sm text-[var(--foreground)] mt-2 leading-relaxed">
            {education.description}
          </p>
        )}
      </div>
    </div>
  )
}

interface EducationSectionProps {
  education: Education[]
  isOwnProfile?: boolean
}

export function EducationSection({ education, isOwnProfile = false }: EducationSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Education</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" className="text-[var(--primary)]">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
        {education.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)] py-4">
            No education history added yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
