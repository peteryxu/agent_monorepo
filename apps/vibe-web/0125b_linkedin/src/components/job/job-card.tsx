"use client";

import { type Job } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, MapPin, Users, Clock } from "lucide-react";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick?: () => void;
  onSave?: () => void;
}

function formatSalary(job: Job): string | null {
  if (!job.salary) return null;

  const { min, max, currency, period } = job.salary;
  const formatNumber = (n: number) => {
    if (n >= 1000) {
      return `$${Math.round(n / 1000)}K`;
    }
    return `$${n}`;
  };

  const periodLabel = period === "yearly" ? "/yr" : period === "monthly" ? "/mo" : "/hr";
  return `${formatNumber(min)} - ${formatNumber(max)}${periodLabel}`;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

export function JobCard({ job, isSelected, onClick, onSave }: JobCardProps) {
  const salary = formatSalary(job);

  return (
    <div
      className={cn(
        "group relative flex gap-3 p-4 border-b border-[var(--border)] cursor-pointer transition-colors",
        isSelected
          ? "bg-[var(--accent)]"
          : "hover:bg-[var(--muted)]/50"
      )}
      onClick={onClick}
    >
      {/* Company Logo */}
      <div className="shrink-0">
        <img
          src={job.companyLogo}
          alt={job.companyName}
          className="w-14 h-14 rounded-lg object-cover border border-[var(--border)]"
        />
      </div>

      {/* Job Details */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)] hover:underline truncate">
          {job.title}
        </h3>

        {/* Company Name */}
        <p className="text-sm text-[var(--muted-foreground)] truncate">
          {job.companyName}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-sm text-[var(--muted-foreground)]">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{job.location}</span>
          {job.workplaceType === "remote" && (
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0 h-5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              Remote
            </Badge>
          )}
          {job.workplaceType === "hybrid" && (
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0 h-5"
            >
              Hybrid
            </Badge>
          )}
        </div>

        {/* Salary (if available) */}
        {salary && (
          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {salary}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
          {/* Easy Apply Badge */}
          {job.isEasyApply && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1.5 py-0 h-5">
              <Briefcase className="w-3 h-3 mr-1" />
              Easy Apply
            </Badge>
          )}

          {/* Applicants */}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applicants} applicants</span>
          </div>

          {/* Posted Time */}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimeAgo(job.postedAt)}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          <Bookmark
            className={cn(
              "w-4 h-4",
              job.isSaved
                ? "fill-[var(--primary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)]"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
