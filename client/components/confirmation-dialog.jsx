"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle } from "lucide-react"

export default function ConfirmationDialog({ open, onConfirm, onCancel, fileName }) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle>File Upload Successful</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{fileName}</span>
              </div>
              <span>
                Your file has been uploaded successfully. You can now start
                asking questions about its content.
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Upload Different File
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            Start Chatting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
