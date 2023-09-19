"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { isAuthenticated } from "./utils/auth";
import { useRouter } from "next/navigation";
import UploadedImages from "./components/uploaded/UploadedImages";
import Search from "./components/search/Search";

function Home() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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
  }

  function uploadImages() {
    // Check if there are images to upload
    if (images.length === 0) {
      console.log("No images to upload");
      return;
    }

    // Retrieve previously uploaded images from local storage
    const existingImages =
      JSON.parse(localStorage.getItem("uploadedImages")) || [];

    // Combine existing images and newly uploaded images
    const combinedImages = [...existingImages, ...images];

    // Store the combined images in local storage
    localStorage.setItem("uploadedImages", JSON.stringify(combinedImages));

    // Clear the images array
    setImages([]);

    // Display the combined images in a viewable div
    const uploadedImagesDiv = document.getElementById("uploadedImages");
    if (uploadedImagesDiv) {
      uploadedImagesDiv.innerHTML = "";
      combinedImages.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = image.url;
        imgElement.alt = image.name;
        imgElement.draggable = true; // Make the image draggable
        uploadedImagesDiv.appendChild(imgElement);
      });
    }

    // Show alert for successful upload
    setAlertMessage("Image was uploaded successfully!");

    // Automatically reload the app after a few seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000); // Reload after 3 seconds
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <p>Upload & Rearrange your images </p>

        <Search />
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
            Drag images here{" "}
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
          </div>
        ))}
      </div>
      <button type="button" onClick={() => uploadImages()}>
        Upload Image
      </button>
      {/* Display the alert message */}
      {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
      <UploadedImages />
    </div>
  );
}

export default Home;
