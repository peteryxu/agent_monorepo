"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { jobs, companies, currentUser } from "@/lib/mock-data";
import { type Job } from "@/lib/types";
import { JobCard } from "@/components/job/job-card";
import { JobDetail } from "@/components/job/job-detail";
import { JobFilters, defaultFilters, type JobFiltersState } from "@/components/job/job-filters";
import { JobSearch } from "@/components/job/job-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bookmark, CheckCircle, Briefcase, SlidersHorizontal, X } from "lucide-react";

export default function JobsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<JobFiltersState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Avoid hydration mismatch by only rendering dynamic content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique company names for filter
  const availableCompanies = useMemo(() => {
    const names = new Set(jobs.map((j) => j.companyName));
    return Array.from(names).sort();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Location filter
      if (searchLocation) {
        const location = searchLocation.toLowerCase();
        const matchesLocation =
          job.location.toLowerCase().includes(location) ||
          (job.workplaceType === "remote" && "remote".includes(location));
        if (!matchesLocation) return false;
      }

      // Date posted filter
      if (filters.datePosted) {
        const now = new Date();
        const postDate = job.postedAt;
        const diffDays = Math.floor(
          (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (filters.datePosted === "24h" && diffDays > 1) return false;
        if (filters.datePosted === "week" && diffDays > 7) return false;
        if (filters.datePosted === "month" && diffDays > 30) return false;
      }

      // Experience level filter
      if (
        filters.experienceLevel.length > 0 &&
        !filters.experienceLevel.includes(job.experienceLevel)
      ) {
        return false;
      }

      // Company filter
      if (
        filters.companies.length > 0 &&
        !filters.companies.includes(job.companyName)
      ) {
        return false;
      }

      // Job type filter
      if (filters.jobType.length > 0 && !filters.jobType.includes(job.jobType)) {
        return false;
      }

      // Workplace type filter
      if (
        filters.workplaceType.length > 0 &&
        !filters.workplaceType.includes(job.workplaceType)
      ) {
        return false;
      }

      // Salary filter
      if (filters.salaryRange.min !== null && job.salary) {
        if (job.salary.max < filters.salaryRange.min) return false;
      }
      if (filters.salaryRange.max !== null && job.salary) {
        if (job.salary.min > filters.salaryRange.max) return false;
      }

      // Easy Apply filter
      if (filters.easyApplyOnly && !job.isEasyApply) {
        return false;
      }

      return true;
    });
  }, [searchQuery, searchLocation, filters]);

  // Set initial selected job after filtering
  useEffect(() => {
    if (mounted && filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [mounted, filteredJobs, selectedJob]);

  // Get saved and applied jobs counts
  const savedJobsCount = jobs.filter((j) => j.isSaved).length;
  const appliedJobsCount = jobs.filter((j) => j.hasApplied).length;

  // Get suggested jobs for the detail panel
  const suggestedJobs = useMemo(() => {
    if (!selectedJob) return [];
    return filteredJobs
      .filter((j) => j.id !== selectedJob.id)
      .slice(0, 3);
  }, [selectedJob, filteredJobs]);

  // User skills for matching
  const userSkills = currentUser.skills.map((s) => s.name);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
    setSelectedJob(null);
  };

  const handleToggleSave = (job: Job) => {
    // In a real app, this would update the backend
    console.log("Toggle save:", job.id);
  };

  const handleApply = (job: Job) => {
    // In a real app, this would open an apply modal or redirect
    console.log("Apply to:", job.id);
  };

  if (!mounted) {
    // Render a skeleton or placeholder during SSR
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="container mx-auto px-4 py-6">
          <div className="h-16 bg-[var(--card)] rounded-lg animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="w-80 h-96 bg-[var(--card)] rounded-lg animate-pulse" />
            <div className="flex-1 h-96 bg-[var(--card)] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-6">
          <JobSearch
            onSearch={handleSearch}
            initialQuery={searchQuery}
            initialLocation={searchLocation}
          />
        </div>

        {/* Quick Links */}
        <div className="flex gap-4 mb-6">
          <Link href="/jobs/saved">
            <Button variant="outline" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Saved jobs
              {savedJobsCount > 0 && (
                <span className="ml-1 text-xs bg-[var(--muted)] px-2 py-0.5 rounded-full">
                  {savedJobsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/jobs/applied">
            <Button variant="outline" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Applied jobs
              {appliedJobsCount > 0 && (
                <span className="ml-1 text-xs bg-[var(--muted)] px-2 py-0.5 rounded-full">
                  {appliedJobsCount}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={() => setFilters(defaultFilters)}
              availableCompanies={availableCompanies}
            />
          </aside>

          {/* Filters Sidebar - Mobile Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-[var(--background)]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <JobFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearAll={() => setFilters(defaultFilters)}
                  availableCompanies={availableCompanies}
                />
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="w-full lg:w-[40%] shrink-0">
            <Card className="overflow-hidden">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Jobs you may be interested in
                  </CardTitle>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {filteredJobs.length} results
                  </span>
                </div>
              </CardHeader>
              <Separator />
              <ScrollArea className="h-[calc(100vh-280px)]">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSelected={selectedJob?.id === job.id}
                      onClick={() => setSelectedJob(job)}
                      onSave={() => handleToggleSave(job)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Briefcase className="w-12 h-12 text-[var(--muted-foreground)] mb-4" />
                    <h3 className="font-semibold mb-2">No jobs found</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Try adjusting your search or filters to find what you&apos;re
                      looking for.
                    </p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setSearchQuery("");
                        setSearchLocation("");
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Job Detail Panel */}
          <div className="hidden lg:block flex-1">
            <Card className="overflow-hidden h-[calc(100vh-200px)]">
              {selectedJob ? (
                <JobDetail
                  job={selectedJob}
                  userSkills={userSkills}
                  onApply={() => handleApply(selectedJob)}
                  onSave={() => handleToggleSave(selectedJob)}
                  suggestedJobs={suggestedJobs}
                  onSelectJob={setSelectedJob}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Briefcase className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Select a job to view details
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Click on a job listing to see the full description and apply.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
