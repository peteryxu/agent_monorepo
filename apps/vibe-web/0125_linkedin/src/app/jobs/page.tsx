"use client"

import { useState, useMemo } from "react"
import { Briefcase, Bell, Bookmark, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard } from "@/components/job/job-card"
import { JobFilters } from "@/components/job/job-filters"
import { jobs } from "@/lib/mock-data"

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.skills.some((s) => s.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Active filters
      for (const filter of activeFilters) {
        if (filter === "remote" && job.workplaceType !== "remote") return false
        if (filter === "easy-apply" && !job.isEasyApply) return false
        if (filter === "full-time" && job.jobType !== "full-time") return false
        if (filter === "entry" && job.experienceLevel !== "entry") return false
        if (filter === "mid-senior" && job.experienceLevel !== "mid-senior") return false
      }

      return true
    })
  }, [searchQuery, activeFilters])

  const savedJobs = jobs.filter((j) => j.isSaved)
  const appliedJobs = jobs.filter((j) => j.isApplied)

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[225px] shrink-0">
          <Card>
            <CardContent className="p-0">
              <nav className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 text-left">
                  <Bookmark className="h-5 w-5" />
                  My jobs
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 text-left">
                  <Bell className="h-5 w-5" />
                  Job alerts
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 text-left">
                  <FileCheck className="h-5 w-5" />
                  Application settings
                </button>
              </nav>
            </CardContent>
          </Card>

          {/* Suggested searches */}
          <Card className="mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Suggested searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Software Engineer", "Remote", "Startup", "Senior Developer", "Product Manager"].map(
                (term) => (
                  <Button
                    key={term}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-primary"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="search">
                <TabsList className="w-full justify-start bg-transparent h-auto p-0 mb-4">
                  <TabsTrigger
                    value="search"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Job search
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved ({savedJobs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="applied"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <FileCheck className="mr-2 h-4 w-4" />
                    Applied ({appliedJobs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search">
                  <JobFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilters={activeFilters}
                    onFilterToggle={toggleFilter}
                  />

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {filteredJobs.length} jobs found
                    </p>
                    <div className="space-y-3">
                      {filteredJobs.slice(0, 20).map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="saved">
                  {savedJobs.length > 0 ? (
                    <div className="space-y-3">
                      {savedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No saved jobs</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Save jobs to review them later
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="applied">
                  {appliedJobs.length > 0 ? (
                    <div className="space-y-3">
                      {appliedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No applications yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Jobs you apply to will appear here
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
