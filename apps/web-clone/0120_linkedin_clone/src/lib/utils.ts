import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers: 1.2K, 45M, etc.
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`
  }
  return count.toString()
}

// Format relative time: 2h, 3d, 1w, Jan 15
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffMinutes < 1) return "now"
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  if (diffWeeks < 4) return `${diffWeeks}w`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Format duration: "Jan 2020 - Present" or "Jan 2020 - Dec 2022 · 2 yrs 11 mos"
export function formatDuration(startDate: Date, endDate?: Date): string {
  const start = startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  const end = endDate
    ? endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Present"

  const endDateForCalc = endDate || new Date()
  const months = (endDateForCalc.getFullYear() - startDate.getFullYear()) * 12 +
    (endDateForCalc.getMonth() - startDate.getMonth())

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  let durationStr = ""
  if (years > 0) {
    durationStr += `${years} yr${years > 1 ? "s" : ""}`
  }
  if (remainingMonths > 0) {
    if (years > 0) durationStr += " "
    durationStr += `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`
  }
  if (!durationStr) {
    durationStr = "< 1 mo"
  }

  return `${start} - ${end} · ${durationStr}`
}

// Format salary range: "$150K - $200K"
export function formatSalary(salary: { min: number; max: number; currency: string }): string {
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}K`
    }
    return `$${amount}`
  }

  return `${formatAmount(salary.min)} - ${formatAmount(salary.max)}`
}

// Format applicants: "23 applicants" or "Be among the first 10 applicants"
export function formatApplicants(count: number): string {
  if (count <= 10) {
    return `Be among the first ${count} applicant${count === 1 ? "" : "s"}`
  }
  return `${formatCount(count)} applicant${count === 1 ? "" : "s"}`
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

// Get top reactions from counts (returns top 3 reaction types)
export function getTopReactions(reactions: { [key: string]: number }): string[] {
  const entries = Object.entries(reactions)
    .filter(([key]) => key !== "total")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .filter(([, count]) => count > 0)

  return entries.map(([key]) => key)
}
