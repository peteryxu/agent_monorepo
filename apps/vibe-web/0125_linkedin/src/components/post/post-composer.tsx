"use client"

import { useState } from "react"
import { Image, Video, Calendar, FileText, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser } from "@/lib/mock-data"
import { getInitials } from "@/lib/utils"
import { toast } from "sonner"

const MAX_CHARS = 3000

export function PostComposer() {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handlePost = () => {
    if (!content.trim()) return
    toast.success("Post published!")
    setContent("")
    setIsFocused(false)
  }

  const charCount = content.length
  const charPercentage = (charCount / MAX_CHARS) * 100

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <button
              onClick={() => setIsFocused(true)}
              className="w-full text-left px-4 py-3 border rounded-full text-muted-foreground text-sm hover:bg-muted/50 transition-colors"
            >
              Start a post, try writing with AI
            </button>
          </div>
        </div>

        {/* Media buttons */}
        <div className="flex items-center justify-between mt-3 pt-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Image className="h-5 w-5 text-blue-500" />
              <span className="hidden sm:inline">Media</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Video className="h-5 w-5 text-green-500" />
              <span className="hidden sm:inline">Video</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Calendar className="h-5 w-5 text-amber-500" />
              <span className="hidden sm:inline">Event</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <FileText className="h-5 w-5 text-orange-500" />
              <span className="hidden sm:inline">Article</span>
            </Button>
          </div>
        </div>

        {/* Expanded composer */}
        {isFocused && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in-0">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {getInitials(currentUser.firstName, currentUser.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Post to Anyone
                    </p>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What do you want to talk about?"
                  className="w-full mt-4 min-h-[200px] text-lg bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground"
                  autoFocus
                  maxLength={MAX_CHARS}
                />

                {/* Media buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Video className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {charCount > 0 && (
                      <>
                        <div className="relative h-5 w-5">
                          <svg className="h-5 w-5 -rotate-90">
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              fill="none"
                              strokeWidth="2"
                              className="stroke-muted"
                            />
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              fill="none"
                              strokeWidth="2"
                              strokeDasharray={50.27}
                              strokeDashoffset={50.27 - (50.27 * charPercentage) / 100}
                              className={charPercentage > 90 ? "stroke-destructive" : "stroke-primary"}
                            />
                          </svg>
                        </div>
                        {charCount > MAX_CHARS * 0.9 && (
                          <span className="text-xs text-muted-foreground">
                            {MAX_CHARS - charCount}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsFocused(false)
                        setContent("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePost}
                      disabled={!content.trim() || charCount > MAX_CHARS}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
