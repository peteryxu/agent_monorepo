"use client"

import { useState, useMemo } from "react"
import { Search, Sliders } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { JobCard } from "@/components/job/job-card"
import { jobs } from "@/lib/mock-data"

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [workplaceFilter, setWorkplaceFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = job.title.toLowerCase().includes(query)
        const matchesCompany = job.company.name.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCompany) return false
      }

      // Workplace filter
      if (workplaceFilter !== "all" && job.workplaceType !== workplaceFilter) {
        return false
      }

      // Type filter
      if (typeFilter !== "all" && job.employmentType !== typeFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, workplaceFilter, typeFilter])

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <div className="flex w-full max-w-[1128px]">
        {/* Left sidebar */}
        <div className="hidden md:flex w-[68px] lg:w-[225px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-4 space-y-4 pb-24 md:pb-4">
          {/* Search and filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={workplaceFilter}
                    onChange={(e) => setWorkplaceFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="all">All locations</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="all">All types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
            </h1>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Sliders className="h-4 w-4 mr-2" />
              More filters
            </Button>
          </div>

          {/* Job listings */}
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {filteredJobs.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No jobs found matching your criteria
                </p>
              </Card>
            )}
          </div>
        </main>

        {/* Right sidebar - job suggestions */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 py-4 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jobs for you</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="text-sm">
                  <p className="font-medium text-primary hover:underline cursor-pointer">
                    {job.title}
                  </p>
                  <p className="text-muted-foreground">{job.company.name}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm">
                Show all
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
