import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with Tailwind CSS conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with K/M/B suffixes for compact display.
 *
 * @example
 * formatCount(1234) // => "1.2K"
 * formatCount(1234567) // => "1.2M"
 * formatCount(500) // => "500"
 */
export function formatCount(n: number): string {
  if (n < 1000) {
    return n.toString()
  }

  if (n < 1000000) {
    const value = n / 1000
    return value >= 10 ? `${Math.floor(value)}K` : `${value.toFixed(1).replace(/\.0$/, '')}K`
  }

  if (n < 1000000000) {
    const value = n / 1000000
    return value >= 10 ? `${Math.floor(value)}M` : `${value.toFixed(1).replace(/\.0$/, '')}M`
  }

  const value = n / 1000000000
  return value >= 10 ? `${Math.floor(value)}B` : `${value.toFixed(1).replace(/\.0$/, '')}B`
}

/**
 * Formats a date as a relative time string.
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)) // => "2h"
 * formatRelativeTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // => "3d"
 * formatRelativeTime(new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000)) // => "2w"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) {
    return 'now'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`
  }

  if (diffHours < 24) {
    return `${diffHours}h`
  }

  if (diffDays < 7) {
    return `${diffDays}d`
  }

  if (diffWeeks < 4) {
    return `${diffWeeks}w`
  }

  if (diffMonths < 12) {
    return `${diffMonths}mo`
  }

  return `${diffYears}y`
}

/**
 * Formats a relative time with "ago" suffix for longer form.
 *
 * @example
 * formatRelativeTimeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000)) // => "2 hours ago"
 * formatRelativeTimeAgo(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) // => "3 days ago"
 */
export function formatRelativeTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) {
    return 'just now'
  }

  if (diffMinutes === 1) {
    return '1 minute ago'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  }

  if (diffHours === 1) {
    return '1 hour ago'
  }

  if (diffHours < 24) {
    return `${diffHours} hours ago`
  }

  if (diffDays === 1) {
    return '1 day ago'
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  if (diffWeeks === 1) {
    return '1 week ago'
  }

  if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`
  }

  if (diffMonths === 1) {
    return '1 month ago'
  }

  if (diffMonths < 12) {
    return `${diffMonths} months ago`
  }

  if (diffYears === 1) {
    return '1 year ago'
  }

  return `${diffYears} years ago`
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * Formats a duration between two dates in LinkedIn style.
 *
 * @example
 * formatDuration(new Date('2020-01-01'), new Date('2024-06-15'))
 * // => "Jan 2020 - Jun 2024 · 4 yrs 6 mos"
 *
 * formatDuration(new Date('2023-03-01'), undefined)
 * // => "Mar 2023 - Present · 1 yr 10 mos"
 */
export function formatDuration(start: Date, end?: Date): string {
  const endDate = end || new Date()
  const startMonth = MONTH_NAMES[start.getMonth()]
  const startYear = start.getFullYear()

  const endPart = end
    ? `${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`
    : 'Present'

  // Calculate duration
  let months = (endDate.getFullYear() - start.getFullYear()) * 12
  months += endDate.getMonth() - start.getMonth()

  // Adjust if end day is before start day
  if (endDate.getDate() < start.getDate()) {
    months -= 1
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  let durationStr = ''
  if (years > 0) {
    durationStr += `${years} yr${years > 1 ? 's' : ''}`
  }
  if (remainingMonths > 0) {
    if (durationStr) durationStr += ' '
    durationStr += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`
  }
  if (!durationStr) {
    durationStr = '< 1 mo'
  }

  return `${startMonth} ${startYear} - ${endPart} · ${durationStr}`
}

/**
 * Formats a date as "Month Year" (e.g., "January 2024")
 */
export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES_FULL[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Formats a date as "Mon D, YYYY" (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/**
 * Formats a salary range for job listings.
 *
 * @example
 * formatSalaryRange({ min: 80000, max: 120000, currency: 'USD', period: 'yearly' })
 * // => "$80K - $120K/yr"
 */
export function formatSalaryRange(salary: {
  min: number
  max: number
  currency: string
  period: 'hourly' | 'monthly' | 'yearly'
}): string {
  const formatAmount = (n: number): string => {
    if (n >= 1000) {
      return `$${Math.round(n / 1000)}K`
    }
    return `$${n}`
  }

  const periodSuffix = {
    hourly: '/hr',
    monthly: '/mo',
    yearly: '/yr',
  }[salary.period]

  return `${formatAmount(salary.min)} - ${formatAmount(salary.max)}${periodSuffix}`
}

/**
 * Truncates text to a maximum length with ellipsis.
 *
 * @example
 * truncate("This is a long text", 10) // => "This is a..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generates initials from a name.
 *
 * @example
 * getInitials("John Doe") // => "JD"
 * getInitials("Alice") // => "A"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Pluralizes a word based on count.
 *
 * @example
 * pluralize(1, 'comment', 'comments') // => "1 comment"
 * pluralize(5, 'comment', 'comments') // => "5 comments"
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/**
 * Generates a random color for avatar backgrounds based on name.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
