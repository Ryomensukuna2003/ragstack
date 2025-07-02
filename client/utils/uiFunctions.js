import { useCallback } from "react";
import { handleYtLink, validateFile } from "./fileUpload";
import { toast } from "sonner";

export const handleKeyPress = (e, YtLink, setYtVideoDetails, setShowYtPreview) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleYtLink(YtLink, setYtVideoDetails, setShowYtPreview);
    }
};

export const handleDrag = (setDragActive) => useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
    } else if (e.type === "dragleave") {
        setDragActive(false);
    }
}, [setDragActive]);

export const handleDrop = (setDragActive, handleFileSelection) => useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
    }
}, [setDragActive, handleFileSelection]);

export const createHandleFileSelection = (setSelectedFile, setUploadStatus, setUploadProgress) => (file) => {
    const validation = validateFile(file);

    if (!validation.valid) {
        toast.error(validation.error);
        return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
    setUploadProgress(0);
};

export const createHandleFileInput = (handleFileSelection) => (e) => {
    if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
    }
};

export const createRemoveFile = (setSelectedFile, setUploadStatus, setUploadProgress, fileInputRef) => () => {
    setSelectedFile(null);
    setUploadStatus(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
};