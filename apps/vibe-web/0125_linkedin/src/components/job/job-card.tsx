"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Building2, Clock, Bookmark, BookmarkCheck, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime, formatSalary } from "@/lib/utils"
import type { Job } from "@/lib/types"
import { toast } from "sonner"

interface JobCardProps {
  job: Job
  compact?: boolean
}

export function JobCard({ job, compact = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(job.isSaved)

  const toggleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? "Job removed from saved" : "Job saved")
  }

  if (compact) {
    return (
      <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <Image
          src={job.company.logo}
          alt={job.company.name}
          width={48}
          height={48}
          className="rounded shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.id}`} className="font-semibold text-sm hover:underline line-clamp-1">
            {job.title}
          </Link>
          <p className="text-sm text-muted-foreground">{job.company.name}</p>
          <p className="text-xs text-muted-foreground">{job.location}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleSave}>
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={job.company.logo}
            alt={job.company.name}
            width={56}
            height={56}
            className="rounded shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/jobs/${job.id}`} className="font-semibold text-primary hover:underline">
                  {job.title}
                </Link>
                <p className="text-sm">{job.company.name}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleSave}>
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.workplaceType}
              </span>
            </div>

            {job.salary && (
              <p className="text-sm font-medium text-success mt-2">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mt-3">
              {job.isEasyApply && (
                <Badge variant="secondary" className="text-xs">
                  <Briefcase className="mr-1 h-3 w-3" />
                  Easy Apply
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {job.jobType.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {job.experienceLevel.replace("-", " ")}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(job.postedAt)}
              </span>
              <span>{job.applicants} applicants</span>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1">
                {job.isEasyApply ? "Easy Apply" : "Apply"}
              </Button>
              <Button variant="outline" size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
