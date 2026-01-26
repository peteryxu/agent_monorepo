"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { X, Search, ChevronDown, ChevronUp } from "lucide-react";

export interface JobFiltersState {
  datePosted: string | null;
  experienceLevel: string[];
  companies: string[];
  jobType: string[];
  workplaceType: string[];
  salaryRange: { min: number | null; max: number | null };
  easyApplyOnly: boolean;
}

interface JobFiltersProps {
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  onClearAll: () => void;
  availableCompanies?: string[];
}

const DATE_OPTIONS = [
  { value: "24h", label: "Past 24 hours" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
  { value: "any", label: "Any time" },
];

const EXPERIENCE_OPTIONS = [
  { value: "entry", label: "Entry level" },
  { value: "associate", label: "Associate" },
  { value: "mid-senior", label: "Mid-Senior level" },
  { value: "director", label: "Director" },
  { value: "executive", label: "Executive" },
];

const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
];

const WORKPLACE_OPTIONS = [
  { value: "on-site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

const SALARY_RANGES = [
  { min: 40000, max: 60000, label: "$40K - $60K" },
  { min: 60000, max: 80000, label: "$60K - $80K" },
  { min: 80000, max: 100000, label: "$80K - $100K" },
  { min: 100000, max: 120000, label: "$100K - $120K" },
  { min: 120000, max: 150000, label: "$120K - $150K" },
  { min: 150000, max: null, label: "$150K+" },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-4">
      <button
        className="flex items-center justify-between w-full text-left font-semibold text-sm hover:text-[var(--primary)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function JobFilters({
  filters,
  onFiltersChange,
  onClearAll,
  availableCompanies = [],
}: JobFiltersProps) {
  const [companySearch, setCompanySearch] = useState("");

  const updateFilter = <K extends keyof JobFiltersState>(
    key: K,
    value: JobFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (
    key: "experienceLevel" | "companies" | "jobType" | "workplaceType",
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const hasActiveFilters =
    filters.datePosted !== null ||
    filters.experienceLevel.length > 0 ||
    filters.companies.length > 0 ||
    filters.jobType.length > 0 ||
    filters.workplaceType.length > 0 ||
    filters.salaryRange.min !== null ||
    filters.salaryRange.max !== null ||
    filters.easyApplyOnly;

  const filteredCompanies = availableCompanies.filter((company) =>
    company.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--primary)] h-auto p-0 hover:bg-transparent hover:underline"
              onClick={onClearAll}
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="px-4">
            {/* Date Posted */}
            <FilterSection title="Date posted">
              {DATE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="datePosted"
                    checked={filters.datePosted === option.value}
                    onChange={() => updateFilter("datePosted", option.value)}
                    className="w-4 h-4 text-[var(--primary)] border-[var(--border)] focus:ring-[var(--ring)]"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </FilterSection>

            <Separator />

            {/* Experience Level */}
            <FilterSection title="Experience level">
              {EXPERIENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.experienceLevel.includes(option.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("experienceLevel", option.value)
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </FilterSection>

            <Separator />

            {/* Company */}
            <FilterSection title="Company">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  placeholder="Search companies..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {filteredCompanies.slice(0, 10).map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.companies.includes(company)}
                      onCheckedChange={() =>
                        toggleArrayFilter("companies", company)
                      }
                    />
                    <span className="text-sm truncate">{company}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <Separator />

            {/* Job Type */}
            <FilterSection title="Job type">
              {JOB_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.jobType.includes(option.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("jobType", option.value)
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </FilterSection>

            <Separator />

            {/* Workplace Type */}
            <FilterSection title="On-site/Remote">
              {WORKPLACE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.workplaceType.includes(option.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("workplaceType", option.value)
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </FilterSection>

            <Separator />

            {/* Salary Range */}
            <FilterSection title="Salary">
              {SALARY_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="salaryRange"
                    checked={
                      filters.salaryRange.min === range.min &&
                      filters.salaryRange.max === range.max
                    }
                    onChange={() =>
                      updateFilter("salaryRange", {
                        min: range.min,
                        max: range.max,
                      })
                    }
                    className="w-4 h-4 text-[var(--primary)] border-[var(--border)] focus:ring-[var(--ring)]"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </FilterSection>

            <Separator />

            {/* Easy Apply Toggle */}
            <div className="py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="easy-apply" className="font-semibold text-sm">
                  Easy Apply only
                </Label>
                <Switch
                  id="easy-apply"
                  checked={filters.easyApplyOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("easyApplyOnly", checked)
                  }
                />
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Show jobs where you can apply with your LinkedIn profile
              </p>
            </div>

            {/* Show Results Button (for mobile) */}
            <div className="py-4 lg:hidden">
              <Button className="w-full">Show results</Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export const defaultFilters: JobFiltersState = {
  datePosted: null,
  experienceLevel: [],
  companies: [],
  jobType: [],
  workplaceType: [],
  salaryRange: { min: null, max: null },
  easyApplyOnly: false,
};
