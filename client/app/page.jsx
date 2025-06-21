"use client"

import { useState } from "react"
import FileUpload from "@/components/file-upload"
import ChatInterface from "@/components/chat-interface"
import ConfirmationDialog from "@/components/confirmation-dialog"
import axios from "axios";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState("upload") // 'upload', 'confirm', 'chat'
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleFileUpload = (file) => {
    setUploadedFile(file)
    setShowConfirmDialog(true)
  }

  const handleConfirmUpload = () => {
    setShowConfirmDialog(false)
    setCurrentStep("chat")
  }

  const handleCancelUpload = () => {
    setShowConfirmDialog(false)
    setUploadedFile(null)
  }

  const handleStartOver = async () => {
    await axios.delete("http://localhost:3001/api/reset", {
      data: { collectionName: "smart-docs" },
    });
    setCurrentStep("upload");
    setUploadedFile(null);
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep === "upload" && <FileUpload onFileUpload={handleFileUpload} />}

      {currentStep === "chat" && <ChatInterface uploadedFile={uploadedFile} onStartOver={handleStartOver} />}

      <ConfirmationDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        fileName={uploadedFile?.name}
      />
    </div>
  )
}
