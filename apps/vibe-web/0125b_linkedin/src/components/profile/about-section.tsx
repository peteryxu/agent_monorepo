"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AboutSectionProps {
  about: string
  maxLength?: number
}

export function AboutSection({ about, maxLength = 300 }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = about.length > maxLength

  const displayText = shouldTruncate && !isExpanded
    ? about.slice(0, maxLength).trim()
    : about

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
          {displayText}
          {shouldTruncate && !isExpanded && "..."}
        </p>
        {shouldTruncate && (
          <Button
            variant="link"
            className="p-0 h-auto mt-2 text-[var(--primary)] font-semibold"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "...see less" : "...see more"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
