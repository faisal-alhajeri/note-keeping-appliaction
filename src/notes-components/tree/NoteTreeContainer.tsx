import { faFileAlt, faFolder, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { NoteProjectType } from "../../types/types";
import TreeFileDirSlot from "./TreeFileDirSlot";

type props = {
  note: NoteProjectType;
};

export default function NoteTreeContainer() {
  const { note, createFileForSelected, createDirForSelected } = useSingleNoteContext();

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between">
        <h5>Project: {note.name}</h5>
        <div>
          <Button
            className="mx-2"
            variant="outline-secondary"
            onClick={() => createFileForSelected("new file")}
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
            <FontAwesomeIcon icon={faFileAlt} />
          </Button>
          <Button
            className="mx-2"
            variant="outline-secondary"
            onClick={() => createDirForSelected('new folder')}
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
            <FontAwesomeIcon icon={faFolder} />
          </Button>
        </div>
      </div>

      <div>
        <TreeFileDirSlot node={note.root} isDir />
      </div>
    </div>
  );
}
