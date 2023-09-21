import React, { useState, useEffect } from "react";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import styles from "./page.module.css";

function UploadedImages({ tags }) {
  const [uploaded, setUploaded] = useState([]);
  const [droppedImages, setDroppedImages] = useState([]);
  const [originalUploaded, setOriginalUploaded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUploadedData = JSON.parse(localStorage.getItem("uploadedData"));
    let combinedImages = []; // Define combinedImages outside the if-else block

    if (storedUploadedData && Array.isArray(storedUploadedData.images)) {
      // Combine default images and uploaded images
      const defaultImages = [
        {
          name: "Default Image 1",
          url: "https://pbs.twimg.com/profile_images/1528837727722029056/XwHdBNR5_400x400.jpg",
          tags: "Dev clinton, Confidence Emonena Ochuko",
        },
        {
          name: "Default Image 2",
          url: "https://static.independent.co.uk/2023/09/18/15/Asian_Champions_League_Preview_47615.jpg",
          tags: "Ronaldo, footballer, Cristiano, Goat",
        },
        {
          name: "Default Image 3",
          url: "https://cloudfront-us-east-1.images.arcpublishing.com/pmn/OPKHDT2FBPB3Z6WJLYOWTUX3TI.jpg",
          tags: "Messi, Lionel, Goat, footballer",
        },
        {
          name: "Default Image 4",
          url: "https://upload.wikimedia.org/wikipedia/commons/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg",
          tags: "Neymar, footballer, Brazil",
        },
        {
          name: "Default Image 5",
          url: "https://dailypost.ng/wp-content/uploads/2023/05/Osimhen.jpeg",
          tags: "Osimhen, footballer, Victor, Nigeria, Napoli",
        },
      ];
      combinedImages = [...defaultImages, ...storedUploadedData.images];

      setUploaded(combinedImages);
    } else {
      // If no stored data, set default images
      const defaultImages = [
        {
          name: "Default Image 1",
          url: "https://pbs.twimg.com/profile_images/1528837727722029056/XwHdBNR5_400x400.jpg",
          tags: "Dev clinton, Confidence Emonena Ochuko",
        },
        {
          name: "Default Image 2",
          url: "https://static.independent.co.uk/2023/09/18/15/Asian_Champions_League_Preview_47615.jpg",
          tags: "Ronaldo, footballer, Cristiano, Goat",
        },
        {
          name: "Default Image 3",
          url: "https://cloudfront-us-east-1.images.arcpublishing.com/pmn/OPKHDT2FBPB3Z6WJLYOWTUX3TI.jpg",
          tags: "Messi, Lionel, Goat, footballer",
        },
        {
          name: "Default Image 4",
          url: "https://upload.wikimedia.org/wikipedia/commons/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg",
          tags: "Neymar, footballer, Brazil",
        },
        {
          name: "Default Image 5",
          url: "https://dailypost.ng/wp-content/uploads/2023/05/Osimhen.jpeg",
          tags: "Osimhen, footballer, Victor, Nigeria, Napoli",
        },
      ];
      combinedImages = defaultImages;

      setUploaded(defaultImages);
    }

    // Set the originalUploaded state after the if-else block
    setOriginalUploaded(combinedImages);
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

  const handleSearch = (searchQuery) => {
    // Ensure searchQuery is a string
    if (typeof searchQuery !== "string") {
      console.error("Invalid search query:", searchQuery);
      return;
    }

    const lowercaseSearchQuery = searchQuery.toLowerCase(); // Convert search query to lowercase

    const filteredImages = uploaded.filter((image) => {
      // Ensure image.tags is a string
      if (typeof image.tags !== "string") {
        console.error("Invalid tags for image:", image);
        return false; // Skip this image
      }

      const lowercaseImageTags = image.tags.toLowerCase(); // Convert image tags to lowercase
      return lowercaseImageTags.includes(lowercaseSearchQuery);
    });

    // Update the state with filteredImages
    setUploaded(filteredImages);
  };

  // Function to reset the search and show all images
  function resetSearch() {
    setSearchQuery(""); // Reset searchQuery to an empty string
    // Restore the original images
    setUploaded(originalUploaded); // Use the originalUploaded state variable
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
          <button
            onClick={() => handleSearch(searchQuery)}
            className={styles.btnSearch}
          >
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
