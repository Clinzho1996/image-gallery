import React, { useState, useEffect } from "react";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import styles from "./page.module.css";

function UploadedImages({ tags }) {
  const [uploaded, setUploaded] = useState([]);
  const [droppedImages, setDroppedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUploadedData = JSON.parse(localStorage.getItem("uploadedData"));

    if (storedUploadedData && Array.isArray(storedUploadedData.images)) {
      // Combine default images and uploaded images
      const defaultImages = [
        {
          name: "Default Image 1",
          url: "https://media.licdn.com/dms/image/C4E03AQFi9k8dhOmkcQ/profile-displayphoto-shrink_800_800/0/1607973914785?e=2147483647&v=beta&t=nSNwwfjqSezP0f__Y-aMHC17SIrxmiHB31GyreHCEAU",
          tags: "Dev Clinton, Confidence Emonena Ochuko",
        },
      ];
      const combinedImages = [...defaultImages, ...storedUploadedData.images];

      setUploaded(combinedImages);
    } else {
      // If no stored data, set default images
      const defaultImages = [
        {
          name: "Default Image 1",
          url: "https://pbs.twimg.com/profile_images/1528837727722029056/XwHdBNR5_400x400.jpg",
          tags: "Dev Clinton, Confidence Emonena Ochuko",
        },
        {
          name: "Default Image 2",
          url: "https://static.independent.co.uk/2023/09/18/15/Asian_Champions_League_Preview_47615.jpg",
          tags: "Ronaldo, footballer",
        },
      ];
      setUploaded(defaultImages);
    }

    setLoading(false);
  }, []);

  function handleDrop(result) {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    let updatedUploadedImages = [...uploaded];
    let updatedDroppedImages = [...droppedImages];

    // Get the dragged image from the appropriate source
    const draggedImage =
      sourceDroppableId === "uploaded-images"
        ? updatedUploadedImages[sourceIndex]
        : updatedDroppedImages[sourceIndex];

    // Remove the image from its previous tab
    if (sourceDroppableId === "uploaded-images") {
      updatedUploadedImages.splice(sourceIndex, 1);
    } else if (sourceDroppableId === "dropped-images") {
      updatedDroppedImages.splice(sourceIndex, 1);
    }

    // Add the dragged image to the new tab
    if (destinationDroppableId === "uploaded-images") {
      updatedUploadedImages.splice(destinationIndex, 0, draggedImage);
    } else if (destinationDroppableId === "dropped-images") {
      updatedDroppedImages.splice(destinationIndex, 0, draggedImage);
    }

    // Update local storage for each tab separately
    localStorage.setItem(
      "uploadedData",
      JSON.stringify({
        images: updatedUploadedImages,
        tags: tags, // Update tags when images are rearranged
      })
    );

    // Update the state with all uploaded images
    setUploaded(updatedUploadedImages);
    setDroppedImages(updatedDroppedImages);
  }

  // Function to delete an image from the current location
  function deleteImage(index, droppableId) {
    if (droppableId === "uploaded-images") {
      const updatedUploadedImages = [...uploaded];
      updatedUploadedImages.splice(index, 1);

      // Update local storage and state
      localStorage.setItem(
        "uploadedData",
        JSON.stringify({
          images: updatedUploadedImages,
          tags: tags, // Update tags when an image is deleted
        })
      );

      setUploaded(updatedUploadedImages);
    } else if (droppableId === "dropped-images") {
      const updatedDroppedImages = [...droppedImages];
      updatedDroppedImages.splice(index, 1);
      setDroppedImages(updatedDroppedImages);
      localStorage.setItem(
        "droppedImages",
        JSON.stringify(updatedDroppedImages)
      );
    }
  }

  function searchImages() {
    // Retrieve the saved tags from local storage
    const storedUploadedData = JSON.parse(localStorage.getItem("uploadedData"));
    const savedTags = storedUploadedData?.tags || [];

    // Filter images based on the searchQuery and saved tags
    const filteredImages = uploaded.filter((image, index) => {
      if (!searchQuery) return true; // Show all images if search query is empty

      // Check if the image has tags and if any of them match the searchQuery or saved tags
      if (Array.isArray(image.tags)) {
        const hasMatchingTag = image.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const hasSavedTag = savedTags[index]
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return hasMatchingTag || hasSavedTag;
      }
      return false; // Filter out images without tags
    });

    // Update the state with filtered images
    setUploaded(filteredImages);
  }

  // Function to reset the search and show all images
  function resetSearch() {
    setSearchQuery("");
    const storedUploadedData = JSON.parse(localStorage.getItem("uploadedData"));

    if (storedUploadedData && Array.isArray(storedUploadedData.images)) {
      setUploaded(storedUploadedData.images);
    }
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by tags"
          className={styles.searchTag}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.btn}>
          <button onClick={searchImages} className={styles.btnSearch}>
            Search
          </button>
          <button onClick={resetSearch} className={styles.btnReset}>
            Reset
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDrop}>
        <div className={styles.uploadedImagesContainer}>
          <Droppable droppableId="uploaded-images" direction="horizontal">
            {(provided) => (
              <div
                id="uploadedImages"
                className={styles.uploadedImages}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {loading ? (
                  <p
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Loading...
                  </p>
                ) : (
                  uploaded.map((image, index) => (
                    <Draggable
                      key={image?.name}
                      draggableId={image?.name}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={styles.deleteCont}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span
                            className={styles.delete}
                            role="button"
                            onClick={() =>
                              deleteImage(index, "uploaded-images")
                            }
                          >
                            &times;
                          </span>
                          <img src={image?.url} alt={image?.name} />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="dropped-images" direction="horizontal">
            {(provided) => (
              <div
                id="droppedImages"
                className={styles.droppedImages}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {loading ? (
                  <p
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Loading...
                  </p>
                ) : (
                  droppedImages.map((image, index) => (
                    <Draggable
                      key={image.name}
                      draggableId={image.name}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={styles.deleteCont}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span
                            className={styles.delete}
                            role="button"
                            onClick={() => deleteImage(index, "dropped-images")}
                          >
                            &times;
                          </span>
                          <img src={image.url} alt={image.name} />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
}

export default UploadedImages;
