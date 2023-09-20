"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { isAuthenticated } from "./utils/auth";
import { useRouter } from "next/navigation";
import UploadedImages from "./components/uploaded/UploadedImages";

function Home() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    // Check authentication when the component mounts
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuthentication();
  }, []);

  function onSelectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    const newImages = [...images];
    const newTags = [...tags]; // Create a new array for tags
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!newImages.some((e) => e.name === files[i].name)) {
        newImages.push({
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
          tags: "",
        });
        newTags.push(""); // Add an empty tag for each image
      }
    }
    setImages(newImages);
    setTags(newTags); // Update the tags state
  }

  function handleTagInputChange(index, value) {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!newImages.some((e) => e.name === files[i].name)) {
        newImages.push({
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
        });
      }
    }
    setImages(newImages);
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }

  function uploadImages() {
    // Check if there are images to upload
    if (images.length === 0) {
      console.log("No images to upload");
      return;
    }

    // Retrieve previously uploaded images and tags from local storage
    const existingData = JSON.parse(localStorage.getItem("uploadedData")) || {
      images: [],
      tags: [],
    };

    // Combine existing images, tags, and newly uploaded images and tags
    const combinedImages = [...existingData.images, ...images];
    const combinedTags = [...existingData.tags, ...tags];

    // Store the combined data in local storage
    localStorage.setItem(
      "uploadedData",
      JSON.stringify({ images: combinedImages, tags: combinedTags })
    );

    // Clear the images and tags arrays
    setImages([]);
    setTags([]);

    // Show alert for successful upload
    setAlertMessage("Image was uploaded successfully!");

    // Automatically reload the app after a few seconds
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <p>Upload & Rearrange your images </p>
      </div>
      <div
        className={styles.drag}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging ? (
          <span className={styles.select}>Drop images here</span>
        ) : (
          <>
            Drop image here{" "}
            <span
              className={styles.selectBrowse}
              id="select"
              role="button"
              onClick={onSelectFiles}
            >
              Browse
            </span>
          </>
        )}

        <input
          name="file"
          className={styles.file}
          type="file"
          multiple
          ref={fileInputRef}
          onChange={onFileSelect}
        ></input>
      </div>
      <div className={styles.container}>
        {images.map((images, index) => (
          <div className={styles.image} key={images.name}>
            <span
              className={styles.delete}
              role="button"
              onClick={() => deleteImage(index)}
            >
              &times;
            </span>
            <img src={images.url} alt={images.name} />
            <input
              type="text"
              placeholder="Enter tag"
              className={styles.tagInput}
              value={tags[index]}
              onChange={(e) => handleTagInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => uploadImages()}>
        Upload Image
      </button>
      {/* Display the alert message */}
      {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
      <UploadedImages tags={tags} />
    </div>
  );
}

export default Home;
