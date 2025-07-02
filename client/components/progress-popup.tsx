"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

const stages = [
  "Connecting to website...",
  "Analyzing content structure...",
  "Extracting text content...",
  "Processing data...",
  "Optimizing for search...",
  "Finalizing extraction...",
]

interface ProgressPopupProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  websiteUrl?: string
  progress?: number
}

export function ProgressPopup({ isOpen, onOpenChange, websiteUrl, progress: externalProgress = 0 }: ProgressPopupProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("Initializing...")

  useEffect(() => {
    if (isOpen) {
      // Use external progress if provided, otherwise use simulated progress
      if (externalProgress > 0) {
        setProgress(externalProgress)
        
        // Update stage based on external progress
        const stageIndex = Math.floor((externalProgress / 100) * stages.length)
        if (stageIndex < stages.length) {
          setStage(stages[stageIndex])
        }

        // Close dialog when external progress reaches 100%
        if (externalProgress >= 100) {
          setTimeout(() => {
            onOpenChange(false)
            setProgress(0)
          }, 1500)
        }
      } else {
        // Fallback to simulated progress if no external progress
        setProgress(0)
        setStage(stages[0])

        const interval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + Math.random() * 15 + 5
            const clampedProgress = Math.min(newProgress, 100)

            // Update stage based on progress
            const stageIndex = Math.floor((clampedProgress / 100) * stages.length)
            if (stageIndex < stages.length) {
              setStage(stages[stageIndex])
            }

            // Close dialog when complete
            if (clampedProgress >= 100) {
              setTimeout(() => {
                onOpenChange(false)
                setProgress(0)
              }, 1000)
            }

            return clampedProgress
          })
        }, 300)

        return () => clearInterval(interval)
      }
    }
  }, [isOpen, onOpenChange, externalProgress])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border text-card-foreground">
        <DialogTitle className="text-xl font-semibold text-foreground">Website Processing</DialogTitle>
        <div className="space-y-6">
          {/* Header with icon */}
          <div className="flex items-center justify-end">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Status Message */}
          <div className="text-base text-muted-foreground text-center">
            {progress < 100 ? "Extracting content from website..." : "Content extraction completed successfully!"}
          </div>

          {/* Progress Percentage and Badge */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-bold text-primary">{Math.round(progress)}%</span>
            {progress > 30 && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                ↗ {Math.round(progress * 0.6)}%
              </Badge>
            )}
          </div>

          {/* Performance indicator */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">vs. average extraction time</span>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-3">
            <Progress value={progress} className="h-3 bg-muted" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="font-medium">{stage}</span>
              <span className="text-xs">
                {websiteUrl ? new URL(websiteUrl).hostname : ""}
              </span>
            </div>
          </div>

          {/* Segmented Progress Visualization - Vertically Elongated Dots */}
          <div className="flex gap-1 justify-center mt-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div 
                key={i} 
                className={`h-6 w-2 rounded-full transition-colors duration-300 ${
                  i < (progress / 100) * 20 ? "bg-primary" : "bg-muted"
                }`} 
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
