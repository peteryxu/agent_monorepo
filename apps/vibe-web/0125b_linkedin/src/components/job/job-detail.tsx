"use client";

import { type Job } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Users,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface JobDetailProps {
  job: Job;
  userSkills?: string[];
  onApply?: () => void;
  onSave?: () => void;
  suggestedJobs?: Job[];
  onSelectJob?: (job: Job) => void;
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

function formatJobType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

function formatExperienceLevel(level: string): string {
  const labels: Record<string, string> = {
    entry: "Entry level",
    associate: "Associate",
    "mid-senior": "Mid-Senior level",
    director: "Director",
    executive: "Executive",
  };
  return labels[level] || level;
}

export function JobDetail({
  job,
  userSkills = [],
  onApply,
  onSave,
  suggestedJobs = [],
  onSelectJob,
}: JobDetailProps) {
  const salary = formatSalary(job);

  // Calculate skills match
  const matchingSkills = job.skills?.filter((skill) =>
    userSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
  ) || [];
  const totalSkills = job.skills?.length || 0;
  const matchCount = matchingSkills.length;

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-4 mb-6">
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="w-16 h-16 rounded-lg object-cover border border-[var(--border)]"
          />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              {job.title}
            </h1>
            <p className="text-[var(--muted-foreground)]">
              {job.companyName} · {job.location}
              {job.workplaceType !== "on-site" && (
                <span className="ml-1">({job.workplaceType})</span>
              )}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {formatTimeAgo(job.postedAt)} · {job.applicants} applicants
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            className="flex-1"
            onClick={onApply}
            disabled={job.hasApplied}
          >
            {job.isEasyApply && <Briefcase className="w-4 h-4 mr-2" />}
            {job.hasApplied ? "Applied" : job.isEasyApply ? "Easy Apply" : "Apply"}
          </Button>
          <Button variant="outline" size="icon" onClick={onSave}>
            <Bookmark
              className={
                job.isSaved
                  ? "w-4 h-4 fill-[var(--primary)] text-[var(--primary)]"
                  : "w-4 h-4"
              }
            />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span>{formatJobType(job.jobType)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span>{formatExperienceLevel(job.experienceLevel)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span>
              {job.workplaceType === "remote"
                ? "Remote"
                : job.workplaceType === "hybrid"
                ? "Hybrid"
                : "On-site"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span>{job.applicants} applicants</span>
          </div>
        </div>

        {/* Salary */}
        {salary && (
          <div className="bg-[var(--muted)]/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-[var(--muted-foreground)]">
              Base salary range
            </p>
            <p className="text-lg font-semibold">{salary}</p>
          </div>
        )}

        {/* Skills Match */}
        {totalSkills > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Skills</h2>
              {matchCount > 0 && (
                <Badge variant="secondary" className="text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {matchCount} of {totalSkills} skills match your profile
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill) => {
                const isMatch = matchingSkills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isMatch ? "default" : "outline"}
                    className={
                      isMatch
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        : ""
                    }
                  >
                    {isMatch && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* About the job */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">About the job</h2>
          <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"
                >
                  <Circle className="w-2 h-2 mt-1.5 shrink-0 fill-current" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Benefits</h2>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* People Also Viewed */}
        {suggestedJobs.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h2 className="font-semibold mb-4">People also viewed</h2>
              <div className="space-y-3">
                {suggestedJobs.slice(0, 3).map((suggestedJob) => (
                  <Card
                    key={suggestedJob.id}
                    className="p-3 cursor-pointer hover:bg-[var(--muted)]/50 transition-colors"
                    onClick={() => onSelectJob?.(suggestedJob)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={suggestedJob.companyLogo}
                        alt={suggestedJob.companyName}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {suggestedJob.title}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">
                          {suggestedJob.companyName}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {suggestedJob.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
