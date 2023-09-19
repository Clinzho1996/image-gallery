"use client";
import { createContext, useState, useContext } from "react";

export const ThemeContext = createContext();

export const useImageGallery = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const [images, setImages] = useState([]);

  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Function to handle image uploads
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("https://your-api.com/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageUrl = await response.json();
        // Update the state with the new image URL
        setImages([...images, imageUrl]);
      } else {
        // Handle error
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const value = {
    images,
    uploadImage, 
    toggle,
    mode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme ${mode}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
