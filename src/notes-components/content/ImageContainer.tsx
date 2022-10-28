import {
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faMinus,
  faP,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { useNoteNodeimages } from "../../db/db";
import { useFlashMesseges } from "../../flash-messages/context/FlashMessegesContext";
import { NoteFileType } from "../../types/types";
import NoteImage from "./NoteImage";

const MAX_ZOOM = 1;
const MIN_ZOOM = 4;

export default function ImageContainer() {
  const {
    note,
    selectedNode,
    selectNode,
    getParentChain,
    getNode,
    hideImages,
    toggleHideImages,
  } = useSingleNoteContext();
  const { images, saveImage, deleteImage } = useNoteNodeimages(
    note,
    selectedNode as NoteFileType
  );
  const {addErrorMessege} = useFlashMesseges()

  const [imageZoom, setImageZoom] = useState(2);

  function zoomInImages() {
    if (imageZoom > MAX_ZOOM) setImageZoom((old) => old - 1);
  }

  function zoomOutImages() {
    if (imageZoom < MIN_ZOOM) setImageZoom((old) => old + 1);
  }

  const uploadImagesRef = useRef<HTMLInputElement>(null);

  function handleUploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    for (const file of e.target.files!) {
      const reader = new FileReader();
      try{
        reader.onload = () => {
          saveImage(reader.result as string);
  
        };
        reader.readAsDataURL(file);
      } catch(e){
        addErrorMessege(`your file is too big`)
      }
      

    }
  }
  return (
    <>
      {!hideImages ? (
        <div id="node-images-input">
          <input
            onChange={handleUploadImages}
            accept="image/*"
            type={"file"}
            multiple
            hidden
            ref={uploadImagesRef}
          />
          <div className="d-flex justify-content-between pb-3">
            <Button
              variant="outline-light"
              onClick={() => uploadImagesRef.current?.click()}
            >
              Upload Images
            </Button>

            <div>
              <Button
                style={{ padding: "9px" }}
                variant="outline-light"
                disabled={imageZoom === MAX_ZOOM}
                onClick={() => zoomInImages()}
              >
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              </Button>
              <Button
                style={{ padding: "9px" }}
                variant="outline-light"
                className="mx-2"
                disabled={imageZoom === MIN_ZOOM}
                onClick={() => zoomOutImages()}
              >
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </Button>
              <Button
                style={{ padding: "9px" }}
                variant="light"
                onClick={() => toggleHideImages()}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
            </div>
          </div>
          <Row xs={imageZoom}>
            {images.map((image) => {
              return (
                <Col key={`image-${image.uuid}`}>
                  <NoteImage onDelete={deleteImage} image={image} />
                </Col>
              );
            })}
          </Row>
        </div>
      ) : (
        <div id="node-images-input-hidden">
          <Button
            style={{ padding: "9px" }}
            variant="light"
            onClick={() => toggleHideImages()}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      )}
    </>
  );
}
