"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface JobFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

const filterOptions = [
  { id: "remote", label: "Remote" },
  { id: "easy-apply", label: "Easy Apply" },
  { id: "full-time", label: "Full-time" },
  { id: "entry", label: "Entry level" },
  { id: "mid-senior", label: "Mid-Senior" },
]

export function JobFilters({
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterToggle,
}: JobFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, skill, or company"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          All filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => {
          const isActive = activeFilters.includes(filter.id)
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterToggle(filter.id)}
              className="rounded-full"
            >
              {filter.label}
              {isActive && (
                <span className="ml-1">×</span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
