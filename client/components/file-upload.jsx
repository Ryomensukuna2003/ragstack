"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import localFont from "next/font/local";

// Components
import { Input } from "./ui/input";
import SleepingCat from "./ui/neko";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import RotatingText from "@/components/ui/rotatingText";
import { ProgressPopup } from "@/components/progress-popup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Functions
import {
  startEmbeddingYtVideo,
  formatFileSize,
  handleWebsiteLink,
  handleFileUpload,
} from "@/utils/fileUpload";
import {
  handleKeyPress,
  handleDrag,
  handleDrop,
  createHandleFileSelection,
  createHandleFileInput,
  createRemoveFile,
} from "@/utils/uiFunctions";

const monoskaFont = localFont({
  src: "../app/fonts/Monoska.ttf",
});

export default function FileUpload({
  onFileUpload,
  onYtVideoEmbedded,
  setCurrentStep,
  apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  // Progress popup state
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [websiteProgress, setWebsiteProgress] = useState(0);

  const fileInputRef = useRef(null);

  const [YtLink, setYtLink] = useState("");
  const [ytVideoDetails, setYtVideoDetails] = useState(null);
  const [showYtPreview, setShowYtPreview] = useState(false);

  const [websiteLink, setWebsiteLink] = useState("");
  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (websiteLink.trim()) {
        setWebsiteProgress(0); // Reset progress
        setShowProgressPopup(true);
        handleWebsiteLink(websiteLink, setCurrentStep, setWebsiteProgress);
      }
    }
  };

  // Create handler functions
  const handleFileSelection = createHandleFileSelection(
    setSelectedFile,
    setUploadStatus,
    setUploadProgress
  );
  const handleFileInput = createHandleFileInput(handleFileSelection);
  const removeFile = createRemoveFile(
    setSelectedFile,
    setUploadStatus,
    setUploadProgress,
    fileInputRef
  );
  const handleDragEvents = handleDrag(setDragActive);
  const handleDropEvents = handleDrop(setDragActive, handleFileSelection);
  const handleFileUploadEvent = () =>
    handleFileUpload(
      selectedFile,
      setUploading,
      setUploadProgress,
      setUploadStatus,
      apiEndpoint,
      onFileUpload
    );

  const getUploadStatusIcon = () => {
    if (uploadStatus === "success") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (uploadStatus === "error") {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <div
      className={`flex h-screen flex-col bg-background ${monoskaFont.className}`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-5 bg-background">
        {/* Left side - 60% */}
        <div
          className={`flex flex-col h-full w-full col-span-3 border-b border-border md:border-b-0 px-8 bg-background ${monoskaFont.className}`}
        >
          {/* NavBar moved inside left side */}
          <nav className="h-20 bg-background border-border">
            <div className="flex items-center justify-end h-full">
              <span className="text-2xl md:text-4xl text-primary/100 font-light">
                {"["}
              </span>
              <h1 className="text-xl md:text-2xl  font-bold text-primary/100">
                vector-docs{" "}
              </h1>
              <span className="text-2xl md:text-4xl  text-primary/100 font-light">
                {"]"}
              </span>
            </div>
          </nav>

          <div className="flex flex-col justify-center items-start flex-grow">
            <div className="max-w-lg">
              <div
                className={`text-3xl md:text-6xl text-primary font-bold mb-6 font-serif leading-tight ${monoskaFont.className}`}
              >
                Turn Documents Into
                <RotatingText
                  texts={["Conversations", "Knowledge", "Insights", "Answers"]}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-primary text-background overflow-hidden py-0.5 sm:py-1 md:py-2  rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </div>
              <div className="text-muted-foreground text-sm md:base leading-relaxed">
                Upload a PDF, DOCX, DOC, or TXT file to start asking questions
                about its content. Our AI will analyze your document and provide
                intelligent responses.
              </div>
            </div>
            <div className="flex items-center pl-4 pt-4">
              <SleepingCat />
            </div>
          </div>
        </div>

        {/* Right Side - 40% */}
        <Card className="rounded-none border-l col-span-2 border-border bg-card flex items-center justify-center">
          <CardContent className="w-full max-w-md mx-auto ">
            <div
              className={`flex flex-col justify-center bg-muted items-center min-h-[400px] border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                dragActive
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 hover:border-border"
              }`}
              onDragEnter={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDragOver={handleDragEvents}
              onDrop={handleDropEvents}
            >
              {!selectedFile ? (
                <div className="text-center space-y-4 ">
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-base md:text-xl  font-semibold">
                      Drag and drop your file here
                    </h3>
                    <p className="text-base md:text-xl text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />

                  <Button asChild variant="outline" size="lg">
                    <label htmlFor="file-input" className="cursor-pointer ">
                      Choose File
                    </label>
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOCX, DOC, and TXT files up to 10MB
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <div className="flex items-start space-x-3 p-4 border border-border rounded-lg bg-card">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium truncate text-card-foreground"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getUploadStatusIcon()}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-2">
                    {uploading ? (
                      <Button disabled className="w-full" size="lg">
                        Uploading... {uploadProgress}%
                      </Button>
                    ) : uploadStatus === "success" ? (
                      <Button
                        onClick={() => window.location.reload()}
                        className="w-full"
                        size="lg"
                      >
                        Upload Another File
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFileUploadEvent}
                        className="w-full"
                        size="lg"
                      >
                        Upload File
                      </Button>
                    )}

                    {uploadStatus !== "success" && (
                      <Button
                        variant="outline"
                        onClick={removeFile}
                        className="w-full"
                        disabled={uploading}
                      >
                        Choose Different File
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center align-middle text-foreground">
              OR
            </div>
            <div>
              <Input
                placeholder="Enter YT link here"
                value={YtLink}
                onChange={(e) => setYtLink(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(e, YtLink, setYtVideoDetails, setShowYtPreview)
                }
              />
              <p className="text-xs flex w-full justify-end text-muted-foreground">
                Press enter to fetch
              </p>

              {ytVideoDetails && (
                <Dialog
                  open={showYtPreview}
                  onOpenChange={(e) => setShowYtPreview(false)}
                >
                  <DialogContent className={`sm:max-w-md`}>
                    <DialogHeader className="text-center">
                      <DialogTitle
                        className={`flex items-center justify-center`}
                      >
                        Is this the Video?
                      </DialogTitle>
                      <img
                        src={ytVideoDetails?.thumbnail}
                        alt="YT thumbnail"
                        className="rounded-lg mb-4"
                      />
                      <DialogDescription asChild>
                        <div className="space-y-2">
                          <span className="flex items-center  space-x-2">
                            {ytVideoDetails?.title}
                          </span>
                          <span className="flex items-center font-bold justify-end space-x-2">
                            {ytVideoDetails?.channelTitle}
                          </span>
                          <span className="flex items-center justify-end space-x-2">
                            Views : {ytVideoDetails?.views / 1000} K
                          </span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setShowYtPreview(false);
                          setYtLink("");
                          setYtVideoDetails(null);
                        }}
                        disabled={uploading}
                      >
                        Enter diffrent Link
                      </Button>
                      <Button
                        onClick={() =>
                          startEmbeddingYtVideo(
                            YtLink,
                            setUploading,
                            setShowYtPreview,
                            onYtVideoEmbedded,
                            ytVideoDetails
                          )
                        }
                        disabled={uploading}
                        className="w-full sm:w-auto"
                      >
                        {uploading ? "Embedding Video..." : "Start Chatting"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex justify-center align-middle text-foreground">
              OR
            </div>
            <div>
              <Input
                placeholder="Enter Website link here"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                onKeyDown={(e) => handleEnterKey(e, websiteLink)}
              />
              <p className="text-xs flex w-full justify-end text-muted-foreground">
                Press enter to fetch
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ProgressPopup
        isOpen={showProgressPopup}
        onOpenChange={setShowProgressPopup}
        websiteUrl={websiteLink}
        progress={websiteProgress}
      />
    </div>
  );
}
