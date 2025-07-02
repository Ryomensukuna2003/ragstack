"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/file-upload";
import ConfirmationDialog from "@/components/confirmation-dialog";
import Chat from "@/components/chat-interface";
import axios from "axios";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState("upload"); // 'upload', 'confirm', 'chat'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ytVideoDetails, setYtVideoDetails] = useState(null);
  const handleYtVideoEmbedded = (videoDetails) => {
    setYtVideoDetails(videoDetails);
    setCurrentStep("chat");
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setShowConfirmDialog(true);
  };

  const handleConfirmUpload = () => {
    setShowConfirmDialog(false);
    setCurrentStep("chat");
  };

  const handleCancelUpload = () => {
    setShowConfirmDialog(false);
    setUploadedFile(null);
  };

  const handleStartOver = async () => {
    setCurrentStep("upload");
    setUploadedFile(null);
    setYtVideoDetails(null);
    setShowConfirmDialog(false);
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reset`, {
      data: {
        collectionName:
          localStorage.getItem("collectionName") || "default_collection",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep === "upload" && (
        <FileUpload
          onFileUpload={handleFileUpload}
          onYtVideoEmbedded={handleYtVideoEmbedded}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === "chat" && (
        <Chat
          uploadedFile={
            uploadedFile || { name: ytVideoDetails?.title || "document" }
          }
          onStartOver={handleStartOver}
        />
      )}

      <ConfirmationDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
        fileName={uploadedFile?.name}
      />
    </div>
  );
}
