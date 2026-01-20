"use client"

import { useState } from "react"
import { Image as ImageIcon, Video, Calendar, FileText, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { currentUser } from "@/lib/mock-data"
import { getInitials } from "@/lib/utils"

const MAX_CHARS = 3000

interface PostComposerProps {
  onPost?: (content: string) => void
}

export function PostComposer({ onPost }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const canPost = content.trim().length > 0 && !isOverLimit

  const handlePost = () => {
    if (canPost) {
      onPost?.(content)
      setContent("")
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canPost) {
      handlePost()
    }
  }

  return (
    <Card className="p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>

          <DialogTrigger asChild>
            <button className="flex-1 text-left px-4 py-3 rounded-full border bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground">
              Start a post
            </button>
          </DialogTrigger>
        </div>

        {/* Quick action buttons */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setIsOpen(true)}
            >
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <span className="hidden sm:inline text-xs">Photo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setIsOpen(true)}
            >
              <Video className="h-5 w-5 text-green-500" />
              <span className="hidden sm:inline text-xs">Video</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setIsOpen(true)}
            >
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="hidden sm:inline text-xs">Event</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setIsOpen(true)}
            >
              <FileText className="h-5 w-5 text-red-500" />
              <span className="hidden sm:inline text-xs">Article</span>
            </Button>
          </div>
        </div>

        {/* Full composer dialog */}
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>

          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser.name}</p>
              <Button variant="outline" size="sm" className="mt-1 h-6 text-xs rounded-full">
                Post to Anyone
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Textarea
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[150px] resize-none border-0 p-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
          </div>

          {/* Emoji & hashtag */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Media buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Video className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <span
                  className={`text-xs ${
                    isOverLimit
                      ? "text-destructive"
                      : charCount > MAX_CHARS * 0.9
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              )}
              <Button
                onClick={handlePost}
                disabled={!canPost}
                className="rounded-full px-4"
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
