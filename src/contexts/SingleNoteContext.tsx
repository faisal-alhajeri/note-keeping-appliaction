import React, { useContext, useMemo, useState } from "react";
import {
  isNoteDir,
  NoteDirType,
  NoteFileType,
  NoteProjectType,
} from "../types/types";
import { useNotes } from "./NotesContext";
import { v4 as uuidv4 } from "uuid";

export type SingleNoteCtxValues = {
  note: NoteProjectType;
  selectNode: (node: NoteDirType | NoteFileType) => void;
  selectedNode: NoteDirType | NoteFileType;
  createFileForSelected: (name: string) => void;
  createDirForSelected: (name: string) => void;
};

const ctx = React.createContext({} as SingleNoteCtxValues);

export function useSingleNoteContext() {
  return useContext(ctx);
}

export default function SingleNoteProvider({
  children,
  note,
}: {
  children: any;
  note: NoteProjectType;
}) {
  const [selectedUUID, setSelectedUUID] = useState<string>(note.root.uuid);
  const selectedNode: NoteFileType | NoteDirType = useMemo(() => {
    return _getNode(selectedUUID);
  }, [selectedUUID]);

  const { saveNote } = useNotes();
  // helper of getNode
  function _getNodeByUUID(
    current: NoteDirType,
    uuid: string
  ): NoteDirType | NoteFileType | undefined {
    for (let file of current.files) {
      if (file.uuid === uuid) return file;
    }

    for (let dir of current.directories) {
      if (dir.uuid === uuid) {
        return dir;
      } else {
        const node = _getNodeByUUID(dir, uuid);
        if (node !== undefined) {
          return node;
        }
      }
    }
  }

  // get node by rtravesing the tree
  function _getNode(uuid: string): NoteDirType | NoteFileType {
    console.log(uuid);

    const result = _getNodeByUUID(note.root, uuid);
    if (result === undefined) {
      console.log("node not found after traverse");
      return note.root;
    } else {
      console.log("node found", result);
      return result;
    }
  }

  function selectNode(node: NoteDirType | NoteFileType) {
    console.log("we will select:", node.uuid, node.name);

    setSelectedUUID(node.uuid);
  }

  function createFileForSelected(name: string) {
    const newFile: NoteFileType = {
      uuid: uuidv4(),
      name,
      images: [],
    };

    if (isNoteDir(selectedNode)) {
      selectedNode.files.push(newFile);
    } else {
      selectedNode.parent?.files.push(newFile);
    }

    const newNote: NoteProjectType = {
      ...note,
    };

    saveNote(newNote);
  }

  function createDirForSelected(name: string) {
    const parent = isNoteDir(selectedNode) ? selectedNode : selectedNode.parent;

    const newDir: NoteDirType = {
      uuid: uuidv4(),
      name,
      directories: [],
      files: [],
      parent,
    };

    if (isNoteDir(selectedNode)) {
      selectedNode.directories.push(newDir);
    } else {
      selectedNode.parent?.directories.push(newDir);
    }

    const newNote: NoteProjectType = {
      ...note,
    };

    saveNote(newNote);
  }

  const ctxValues = { note, selectNode, selectedNode, createFileForSelected, createDirForSelected };

  return <ctx.Provider value={ctxValues}>{children}</ctx.Provider>;
}
