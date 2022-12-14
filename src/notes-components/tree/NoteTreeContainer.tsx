import {
  faAdd,
  faFileAlt,
  faFileSignature,
  faFolder,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import useKeybordControls from "../../features/keyborad-controls/useKeybordControls";
import { useFlashMesseges } from "../../flash-messages/context/FlashMessegesContext";
import { isNoteDir, NoteDirType, NoteProjectType } from "../../types/types";
import TreeFileDirSlot from "./TreeFileDirSlot";

type props = {
  note: NoteProjectType;
};

export default function NoteTreeContainer() {
  const {
    note,
    createFileForSelected,
    createDirForSelected,
    getNode,
    selectedNode,
    renameSelected,
    selectNext,
    selectPrev,
    show,
    hide,
    reanameMode,
    setReanameMode
  } = useSingleNoteContext();
  const renameInputRef = useRef<HTMLInputElement>(null);
  const { addErrorMessege } = useFlashMesseges();

  useEffect(() => {
    if (reanameMode) renameInputRef.current?.focus();
  }, [reanameMode]);

  useKeybordControls()


  function handleRename(e: React.FormEvent) {
    e.preventDefault();

    const name = renameInputRef.current!.value;
    const parentUUID = selectedNode.parent;
    if (parentUUID === undefined) return setReanameMode(false);
    const parent = getNode(parentUUID) as NoteDirType;

    const otherNames = isNoteDir(selectedNode)
      ? parent.directories.map((uuid) => getNode(uuid).name)
      : parent.files.map((uuid) => getNode(uuid).name);

    if (otherNames.includes(name)) {
      addErrorMessege(`name ( ${name} ) already exsists`);
    } else {
      renameSelected(name);
      setReanameMode(false);
    }
  }

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between">
        <h5>Project: {note.name}</h5>
        <div className="d-flex">
          {/* rename file/folder button */}
          {reanameMode ? (
            <form onSubmit={handleRename}>
              <input
                id="rename-input"
                ref={renameInputRef}
                defaultValue={selectedNode.name}
                style={{ width: "150px", height: "100%" }}
              />
            </form>
          ) : (
            <Button
              className=""
              variant="outline-secondary"
              onClick={() => setReanameMode(true)}
            >
              <FontAwesomeIcon icon={faFileSignature} />
              {/* <input /> */}
            </Button>
          )}

          {/* add file button */}
          <Button
            className="mx-1"
            variant="outline-secondary"
            onClick={() => createFileForSelected("new file")}
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </Button>

          {/* add folder button */}
          <Button
            className="mx"
            variant="outline-secondary"
            onClick={() => createDirForSelected("new folder")}
          >
            <FontAwesomeIcon icon={faFolder} />
          </Button>

        </div>
      </div> 

      <div>
        <TreeFileDirSlot node={getNode(note.root)} />
      </div>
    </div>
  );
}
