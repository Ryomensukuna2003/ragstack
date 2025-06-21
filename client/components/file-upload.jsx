"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios";

export default function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileSelection = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/text",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:3001/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("File uploaded successfully!");
        onFileUpload(selectedFile);
        setUploading(false);
      })
      .catch((error) => {
        console.error("File upload failed:", error);
        toast.error("Failed to upload file. Please try again.");
        setUploading(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Upload Your Document</h1>
        <span className="text-muted-foreground text-lg">
          Upload a PDF or DOCX file to start asking questions about its content
        </span>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Drag and drop your file here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-input" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supports PDF and DOCX files up to 10MB
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {uploading ? (
                  <Button disabled className="w-full">
                    {" Uploading... "}
                  </Button>
                ) : (
                  <Button onClick={handleUpload} className="w-full">
                    Upload File
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
