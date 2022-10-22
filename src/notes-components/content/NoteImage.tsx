import {
  faDeleteLeft,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import { ImageType, uuid } from "../../types/types";

type props = {
  image: ImageType;
  onDelete: (uuid: uuid) => void
};

export default function NoteImage({ image, onDelete }: props) {
  return (
    <div className="note-image-container p-2 w-100">
      <img src={image.src} />
      <Button variant="danger" className="image-delete-button rounded-circle" onClick={() => onDelete(image.uuid)}>
        <FontAwesomeIcon icon={faTrashAlt} size="xs" />
      </Button>
    </div>
  );
}
