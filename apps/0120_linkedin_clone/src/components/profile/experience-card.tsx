"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDuration } from "@/lib/utils"
import type { Experience } from "@/lib/types"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="flex gap-4 py-4">
      <Image
        src={experience.company.logo}
        alt={experience.company.name}
        width={48}
        height={48}
        className="rounded h-12 w-12 object-contain bg-white"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{experience.title}</h3>
        <p className="text-sm">
          <Link
            href="#"
            className="hover:underline hover:text-primary"
          >
            {experience.company.name}
          </Link>
          {" · "}
          <span className="capitalize">{experience.employmentType.replace("-", " ")}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDuration(experience.startDate, experience.endDate)}
        </p>
        {experience.location && (
          <p className="text-sm text-muted-foreground">{experience.location}</p>
        )}
        {experience.description && (
          <p className="mt-2 text-sm">{experience.description}</p>
        )}
      </div>
    </div>
  )
}
