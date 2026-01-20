"use client"

import { useState, useOptimistic, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bookmark, MapPin, Clock, Briefcase, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime, formatSalary, formatApplicants } from "@/lib/utils"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticJob, updateOptimistic] = useOptimistic(
    job,
    (state: Job, update: Partial<Job>) => ({ ...state, ...update })
  )

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(() => {
      updateOptimistic({
        isSaved: !optimisticJob.isSaved,
      })
    })
  }

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex gap-4">
        <Image
          src={job.company.logo}
          alt={job.company.name}
          width={56}
          height={56}
          className="rounded h-14 w-14 object-contain bg-white"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href="#"
                className="font-semibold text-primary hover:underline line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-sm">{job.company.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleSave}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  optimisticJob.isSaved ? "fill-current text-primary" : ""
                }`}
              />
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="capitalize">({job.workplaceType})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {job.salary && (
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatSalary(job.salary)}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs capitalize">
              <Briefcase className="h-3 w-3 mr-1" />
              {job.employmentType.replace("-", " ")}
            </Badge>
            {job.isEasyApply && (
              <Badge className="text-xs bg-success/10 text-success hover:bg-success/20">
                Easy Apply
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(job.postedAt)}
            </span>
            <span>•</span>
            <span>{formatApplicants(job.applicants)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
