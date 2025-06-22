"use client"

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner"
import axios from "axios";

export default function FileUpload({
  onFileUpload,
  apiEndpoint = "http://20.244.83.191:3001/api/upload",
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return {
        valid: false,
        error: "Please upload a PDF, DOCX, DOC, or TXT file only.",
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: "File size must be less than 10MB." };
    }

    if (file.size === 0) {
      return { valid: false, error: "File appears to be empty." };
    }

    return { valid: true };
  };

  const handleFileSelection = (file) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
    setUploadProgress(0);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
        timeout: 30000, // 30 second timeout
      });

      toast.success("File uploaded successfully!");
      setUploadStatus("success");
      onFileUpload?.(selectedFile, response.data);
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadStatus("error");

      if (error.code === "ECONNABORTED") {
        toast.error("Upload timeout. Please try again with a smaller file.");
      } else if (error.response?.status === 413) {
        toast.error("File too large. Please choose a smaller file.");
      } else if (error.response?.status === 415) {
        toast.error("Unsupported file type.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to upload file. Please try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

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
    <div className="flex h-screen flex-col bg-background">
      <div className="grid h-full grid-cols-1 md:grid-cols-2 bg-background">
        {/* Left side */}
        <div className="flex flex-col h-full w-full border-b border-border md:border-b-0 px-8 bg-background">
          {/* NavBar moved inside left side */}
          <nav className="h-20 bg-background border-border">
            <div className="flex items-center justify-end h-full">
              <span className="text-4xl text-primary/100 font-light">
                {"["}
              </span>
              <h1 className="text-2xl font-bold text-primary/100">
                docuquest{" "}
              </h1>
              <span className="text-4xl text-primary/100 font-light">
                {"]"}
              </span>
            </div>
          </nav>

          <div className="flex flex-col justify-center items-start flex-grow">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-6xl text-primary font-bold mb-6 font-serif leading-tight">
                Turn Documents Into Conversations
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Upload a PDF, DOCX, DOC, or TXT file to start asking questions
                about its content. Our AI will analyze your document and provide
                intelligent responses.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <Card className="rounded-none border-l border-border bg-card flex items-center justify-center">
          <CardContent className="w-full max-w-md mx-auto p-8">
            <div
              className={`flex flex-col justify-center items-center min-h-[400px] border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                dragActive
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 hover:border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!selectedFile ? (
                <div className="text-center space-y-4">
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      Drag and drop your file here
                    </h3>
                    <p className="text-muted-foreground">
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
                    <label htmlFor="file-input" className="cursor-pointer">
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
                        onClick={handleUpload}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}