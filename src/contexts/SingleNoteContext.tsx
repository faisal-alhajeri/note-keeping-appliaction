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
  updateText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  renameSelected : (name: string) => void
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
  const {
    note,
    selectNode,
    selectedNode,
    createDirForSelected,
    createFileForSelected,
    getNode,
    getParentChain,
    updateText,
    renameSelected,
  } = useSingleNote(noteUUID);
  const navigate = useNavigate();

  if (note === undefined) {
    navigate("/", { replace: true });
  }

  const ctxValues = {
    note,
    selectNode,
    selectedNode,
    createFileForSelected,
    createDirForSelected,
    getNode,
    getParentChain,
    updateText,
    renameSelected,
  };

  return <ctx.Provider value={ctxValues}>{children}</ctx.Provider>;
}
