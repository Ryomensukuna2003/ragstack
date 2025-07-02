import axios from "axios";
import { toast } from "sonner";

// YT link handler Start ---------------------------------------------------------------------------------------------------------------------

export const handleYtLink = async (YtLink, setYtVideoDetails, setShowYtPreview) => {
  console.log("Link is - " + YtLink);
  // extract video ID from YouTube link
  const videoId = YtLink.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  try {
    if (!videoId) {
      toast.error("Invalid YouTube link. Please provide a valid link.");
      return;
    }

    const videoDetails = await getYouTubeVideoDetails(videoId);
    // console.log("Video Details:", videoDetails);
    setYtVideoDetails(videoDetails);
    setShowYtPreview(true);
    toast.success(`Fetched details for: ${videoDetails.title}`);
  } catch (error) {
    toast.error(
      error.message ||
      "Failed to fetch YouTube video details. Please try again."
    );
    console.error("Error fetching YouTube video details:", error);
  }
};

export const getYouTubeVideoDetails = async (videoId) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;
  const res = await axios.get(url);
  const video = res.data.items[0];

  if (!video) throw new Error("Video not found");
  return {
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    publishDate: video.snippet.publishedAt,
    views: video.statistics.viewCount,
    duration: video.contentDetails.duration,
    thumbnail: video.snippet.thumbnails.high.url,
  };
};

// YT link handler End ---------------------------------------------------------------------------------------------------------------------

export const handleWebsiteLink = async (websiteLink, setCurrentStep, setWebsiteProgress) => {
  if (!websiteLink) {
    toast.error("Please enter a website link.");
    return;
  }
  
  try {
    // Start with initial progress
    setWebsiteProgress(5);
    
    // Simulate gradual progress increase while the actual API call happens
    const progressInterval = setInterval(() => {
      setWebsiteProgress(prev => {
        if (prev < 85) {
          return prev + Math.random() * 8 + 2; // Random increment between 2-10
        }
        return prev; // Stop at 85% until API completes
      });
    }, 200);

    // Make the actual API call
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/web-crawler`,
      {
        URL: websiteLink,
      }
    );

    // Clear the progress simulation
    clearInterval(progressInterval);
    
    // Quick progression to completion
    setWebsiteProgress(90);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setWebsiteProgress(95);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    localStorage.setItem(
      "collectionName",
      response.data.embeddingName || "default_collection"
    );
    
    setWebsiteProgress(100);
    toast.success("Website data fetched and embedded successfully!");
    
    // Wait a bit before switching to chat
    setTimeout(() => {
      setCurrentStep("chat");
    }, 500);
    
  } catch (error) {
    console.error("Got error while fetching website data:", error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch website data. Please try again."
    );
    setWebsiteProgress(0); // Reset progress on error
  }
}


export const startEmbeddingYtVideo = async (YtLink, setUploading, setShowYtPreview, onYtVideoEmbedded, ytVideoDetails) => {
  try {
    setUploading(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/yt-transcript`,
      {
        URL: YtLink,
      }
    );
    localStorage.setItem(
      "collectionName",
      response.data.embeddingName || "default_collection"
    );
    // console.log("Response of yt video:", response.data);
    // Close the preview dialog
    setShowYtPreview(false);
    toast.success("YouTube video embedded successfully!");

    // Call the callback to switch to chat interface
    if (onYtVideoEmbedded) {
      onYtVideoEmbedded(ytVideoDetails);
    }
  } catch (error) {
    console.error("Error embedding YouTube video:", error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Failed to embed YouTube video"
    );
  } finally {
    setUploading(false);
  }
};



export const validateFile = (file) => {
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

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};



export const handleFileUpload = async (selectedFile,
  setUploading,
  setUploadProgress,
  setUploadStatus,
  apiEndpoint,
  onFileUpload) => {
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
    console.log("response of upload --> ", response);
    if (response.status === 200) {
      console.log("collectionName --> " + response.data.embeddingName);
      localStorage.setItem(
        "collectionName",
        response.data.embeddingName || "default_collection"
      );
    }
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