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
      setUploaded(storedUploadedData.images);
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

  return (
    <>
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
