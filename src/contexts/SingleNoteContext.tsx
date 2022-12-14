import React, { useContext, useMemo, useState } from "react";
import {
  isNoteDir,
  NoteDirType,
  NoteFileType,
  NoteProjectType,
  uuid,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { useSingleNote } from "../db/db";
import { useNavigate } from "react-router-dom";

export type SingleNoteCtxValues = {
  note: NoteProjectType;
  selectNode: (node: NoteDirType | NoteFileType) => void;
  selectedNode: NoteDirType | NoteFileType;
  createFileForSelected: (name: string) => void;
  createDirForSelected: (name: string) => void;
  getNode: (uuid: uuid) => NoteDirType | NoteFileType;
  getParentChain: (uuid: uuid) => uuid[];
  renameSelected: (name: string) => void;
  toggleHide: (uuid: uuid) => void;
  selectNext: () => void;
  selectPrev: () => void;
  show: (uuid: uuid) => void
  hide: (uuid: uuid) => void
  hideImages: boolean,
  toggleHideImages: () => void
  reanameMode: boolean,
  setReanameMode: any
};

const ctx = React.createContext({} as SingleNoteCtxValues);

export function useSingleNoteContext() {
  return useContext(ctx);
}

export default function SingleNoteProvider({
  children,
  noteUUID,
}: {
  children: any;
  noteUUID: uuid;
}) {
  const [reanameMode, setReanameMode] = useState(false);
  const [hideImages, _setHideImages] = useState(true)


  const {
    note,
    selectNode,
    selectedNode,
    createDirForSelected,
    createFileForSelected,
    getNode,
    getParentChain,
    renameSelected,
    toggleHide,
    selectNext,
    selectPrev,
    show,
    hide,
  } = useSingleNote(noteUUID);
  const navigate = useNavigate();

  if (note === undefined) {
    navigate("/", { replace: true });
  }

 
  function toggleHideImages(){
      _setHideImages(old => !old)
  }
 


  const ctxValues: SingleNoteCtxValues = {
    note,
    selectNode,
    selectedNode,
    createFileForSelected,
    createDirForSelected,
    getNode,
    getParentChain,
    renameSelected,
    toggleHide,
    selectNext,
    selectPrev,
    show,
    hide,
    hideImages,
    toggleHideImages,
    reanameMode,
    setReanameMode
  };

  return <ctx.Provider value={ctxValues}>{children}</ctx.Provider>;
}
