"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  Image as ImageIcon,
  Video,
  Calendar,
  FileText,
  X,
  Globe,
  ChevronDown,
  Users,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"
import { currentUser } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// Types
// =============================================================================

type Audience = "anyone" | "connections" | "group"

interface AudienceOption {
  value: Audience
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    value: "anyone",
    label: "Anyone",
    icon: Globe,
    description: "Anyone on or off LinkedIn",
  },
  {
    value: "connections",
    label: "Connections only",
    icon: Users,
    description: "Connections on LinkedIn",
  },
  {
    value: "group",
    label: "Group members",
    icon: Lock,
    description: "Members of a group you're in",
  },
]

const MAX_CHARACTERS = 3000

// =============================================================================
// Sub-components
// =============================================================================

function AudienceSelector({
  audience,
  onChange,
}: {
  audience: Audience
  onChange: (audience: Audience) => void
}) {
  const selectedOption = AUDIENCE_OPTIONS.find((o) => o.value === audience) || AUDIENCE_OPTIONS[0]
  const IconComponent = selectedOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <IconComponent className="h-4 w-4" />
          <span>{selectedOption.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {AUDIENCE_OPTIONS.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-start gap-3 py-3",
                audience === option.value && "bg-[var(--accent)]"
              )}
            >
              <OptionIcon className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">{option.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{option.description}</p>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MediaButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="flex-col h-auto py-2 px-4 gap-1"
    >
      <Icon className="h-5 w-5 text-[var(--muted-foreground)]" />
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
    </Button>
  )
}

// =============================================================================
// Expanded Composer Dialog
// =============================================================================

interface ExpandedComposerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onPost: (content: string, audience: Audience) => void
}

function ExpandedComposer({ open, onOpenChange, user, onPost }: ExpandedComposerProps) {
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState<Audience>("anyone")
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const characterCount = content.length
  const isOverLimit = characterCount > MAX_CHARACTERS
  const isEmpty = content.trim().length === 0

  const handlePost = async () => {
    if (isEmpty || isOverLimit || isPosting) return

    setIsPosting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onPost(content, audience)
    setContent("")
    setIsPosting(false)
    onOpenChange(false)
  }

  const handleClose = () => {
    if (content.trim()) {
      // Could show a confirmation dialog here
    }
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-base font-semibold">{user.name}</DialogTitle>
              <AudienceSelector audience={audience} onChange={setAudience} />
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="min-h-[200px] resize-none border-0 p-0 focus-visible:ring-0 text-lg placeholder:text-[var(--muted-foreground)]"
            autoFocus
          />
        </div>

        {/* Media buttons */}
        <div className="px-6 py-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <span className="sr-only">Add photo</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <Video className="h-5 w-5 text-green-600" />
              <span className="sr-only">Add video</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <Calendar className="h-5 w-5 text-amber-600" />
              <span className="sr-only">Create event</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="sr-only">Write article</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="text-sm text-[var(--muted-foreground)]">
            <span className={cn(isOverLimit && "text-red-500 font-medium")}>
              {characterCount}
            </span>
            <span> / {MAX_CHARACTERS}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={isEmpty || isOverLimit || isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// Main Component
// =============================================================================

interface PostComposerProps {
  className?: string
  onPost?: (content: string, audience: Audience) => void
}

export function PostComposer({ className, onPost }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const user = currentUser

  const handlePost = (content: string, audience: Audience) => {
    onPost?.(content, audience)
  }

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          {/* Collapsed view */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 h-12 px-4 text-left rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 transition-colors"
            >
              Start a post
            </button>
          </div>

          {/* Media action buttons */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
            <MediaButton
              icon={ImageIcon}
              label="Photo"
              onClick={() => setIsExpanded(true)}
            />
            <MediaButton
              icon={Video}
              label="Video"
              onClick={() => setIsExpanded(true)}
            />
            <MediaButton
              icon={Calendar}
              label="Event"
              onClick={() => setIsExpanded(true)}
            />
            <MediaButton
              icon={FileText}
              label="Write article"
              onClick={() => setIsExpanded(true)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expanded composer dialog */}
      <ExpandedComposer
        open={isExpanded}
        onOpenChange={setIsExpanded}
        user={user}
        onPost={handlePost}
      />
    </>
  )
}
