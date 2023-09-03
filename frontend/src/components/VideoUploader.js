import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Snackbar, LinearProgress } from "@mui/material";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

function VideoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const fileInputRef = React.createRef(); // Create a ref for the file input element

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Check if a file is selected
    if (selectedFile) {
      // Check if the file type is video
      if (selectedFile.type.startsWith("video/")) {
        setSelectedFile(selectedFile);
      } else {
        // Show a snackbar message for an invalid file type
        setIsSnackbarOpen(true);
        e.target.value = ""; // Clear the file input
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    // Check if a file is selected
    if (droppedFile) {
      // Check if the file type is video
      if (droppedFile.type.startsWith("video/")) {
        setSelectedFile(droppedFile);
      } else {
        // Show a snackbar message for an invalid file type
        setIsSnackbarOpen(true);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // to upload video files
  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    setIsUploading(true);
    const backendURL = "https://video-uploader.onrender.com";
    // const backendURL = "http://localhost:3001";
    try {
      let response; // Initialize response

      // Perform the upload and progress tracking
      await axios
        .post(`${backendURL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percentCompleted);

            // Check if upload is complete
            if (percentCompleted === 100) {
              setIsUploading(false);
              setSelectedFile(null); // Reset the selected file
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset the file input field
              }
            }
          },
        })
        .then((res) => {
          response = res; // Store the response
        });

      setVideoLink(response.data.link);
    } catch (error) {
      console.error("Error uploading video:", error);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleUpload(); // Automatically start upload if a file is selected
    }
  }, [selectedFile]);

  const openFileDialog = () => {
    // Trigger the file input click event to open the file selection dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Container className="gradient-bg d-flex justify-content-center align-items-center">
      <div elevation={3} className="paper-container">
        <h5 className="text-align-center">Video Uploader</h5>
        <div className="flex-content">
          <div className="width-50">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-box"
            >
              <Typography variant="body1">
                Drag and drop a video file here
              </Typography>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file-input"
                ref={fileInputRef} // Associate the ref with the input element
              />
            </div>
            <p className="option-text">or</p>
            <div className="button-wrap">
              <div className="button-bg"></div>
              <button
                type="button"
                onClick={openFileDialog}
                disabled={isUploading}
              >
                Choose File
              </button>
            </div>
          </div>
          <div className="width-50 right-content">
            <h3>Status:</h3>
            {uploadProgress === 0 && (
              <p>No files selected. Please select a file.</p>
            )}
            {uploadProgress > 0 && (
              <div className="margin-top-20">
                <p className="body-text">Uploading: {uploadProgress}%</p>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </div>
            )}
            {!isUploading && videoLink && (
              <div className="margin-top-20">
                <p className="body-text">
                  Your video is uploaded. Share the link below:
                </p>
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {videoLink}
                </a>
                <p className="body-text">Or share via:</p>
                <div className="share-buttons d-flex">
                  <FacebookShareButton url={videoLink}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={videoLink}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={videoLink}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </div>
            )}
          </div>
        </div>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          message="Invalid file type. Please select a video file."
        />
      </div>
    </Container>
  );
}

export default VideoUploader;
