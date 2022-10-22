import useLocalStorage from "../hooks/useLocalStorage";
import {
  isNoteDir,
  NoteDirType,
  NoteFileType,
  NoteNameUUIDMap,
  NoteProjectType,
  uuid,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import React, { useMemo, useState } from "react";

export function useNotes() {
  const { state: noteMap, setState: _setNoteMap } =
    useLocalStorage<NoteNameUUIDMap>("notes-map", {} as NoteNameUUIDMap);

  async function createNewNote(name: string): Promise<boolean> {
    if (noteMap[name] !== undefined) return false;

    const root: NoteDirType = {
      uuid: uuidv4(),
      name: "__root__",
      directories: [],
      files: [],
    };

    const newNote: NoteProjectType = {
      uuid: uuidv4(),
      name,
      root: root.uuid,
      content: {
        [root.uuid]: root,
      },
    };

    _saveNoteToDb(newNote);

    _setNoteMap((old) => {
      return {
        ...old,
        [newNote.name]: newNote.uuid,
      };
    });

    await new Promise((r) => setTimeout(r, 1000));

    return true;
  }

  function deleteNote(name: string) {
    const noteUUID = noteMap[name];
    localStorage.removeItem(`note-${noteUUID}`);

    _setNoteMap((old) => {
      const newNoteMap = {
        ...old,
      };
      delete newNoteMap[name];
      return newNoteMap;
    });
  }

  return { noteMap, createNewNote, deleteNote };
}

export function useSingleNote(uuid: string) {
  const {
    state: note,
    setState: setNote,
    save: _saveNote,
  } = useLocalStorage<NoteProjectType>(`note-${uuid}`, {} as NoteProjectType);

  const [selectedUUID, setSelectedUUID] = useState<uuid>(note.root);
  const selectedNode: NoteFileType | NoteDirType = useMemo(() => {
    return getNode(selectedUUID);
  }, [selectedUUID]);

  function getNode(nodeUUID: uuid): NoteFileType | NoteDirType {
    if (nodeUUID in note.content) {
      return note.content[nodeUUID];
    } else {
      return note.content[note.root];
    }
  }

  function selectNode(node: NoteDirType | NoteFileType) {
    console.log("we will select:", node.uuid, node.name);

    setSelectedUUID(node.uuid);
  }

  function _getNameIfConflict(
    suggistedName: string,
    names: string[],
    num: number
  ): string {
    return names.includes(`${suggistedName} ${num}`)
      ? _getNameIfConflict(suggistedName, names, num + 1)
      : `${suggistedName} ${num}`;
  }

  function createFileForSelected(name: string) {
    const parent: NoteDirType = isNoteDir(selectedNode)
      ? selectedNode
      : (getNode(selectedNode.parent!) as NoteDirType);

    const otherFilesNames = parent.files.map((uuid) => getNode(uuid).name);    
    name = otherFilesNames.includes(name)
      ? _getNameIfConflict(name, otherFilesNames, 1)
      : name;

    const newFile: NoteFileType = {
      uuid: uuidv4(),
      name,
      body: "",
      images: [],
      parent: parent.uuid,
    };

    parent.files.push(newFile.uuid);
    note.content[newFile.uuid] = newFile;

    const newNote: NoteProjectType = {
      ...note,
    };

    setNote(newNote);
  }

  function createDirForSelected(name: string) {
    const parent: NoteDirType = isNoteDir(selectedNode)
      ? selectedNode
      : (getNode(selectedNode.parent!) as NoteDirType);

      const otherDirsNames = parent.directories.map((uuid) => getNode(uuid).name);    
      name = otherDirsNames.includes(name)
        ? _getNameIfConflict(name, otherDirsNames, 1)
        : name;
  

    const newDir: NoteDirType = {
      uuid: uuidv4(),
      name,
      directories: [],
      files: [],
      parent: parent.uuid,
    };

    parent.directories.push(newDir.uuid);
    note.content[newDir.uuid] = newDir;

    const newNote: NoteProjectType = {
      ...note,
    };

    setNote(newNote);
  }

  function getParentChain(uuid: uuid): uuid[] {
    const res: uuid[] = [];

    let current = getNode(uuid);

    while (current != null) {
      res.push(current.uuid);
      if (current.parent === undefined) {
        break;
      } else {
        current = getNode(current.parent);
      }
    }

    res.reverse();
    return res;
  }

  function updateText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!isNoteDir(selectedNode)) {
      setNote((oldNote) => {
        const newNote = { ...oldNote };
        const content = newNote.content[selectedNode.uuid] as NoteFileType;
        content.body = e.target.value;

        return newNote;
      });
    }
  }

  function renameSelected(name: string) {
    selectedNode.name = name;
    setNote((oldNote) => {
      const newNote = { ...oldNote };
      const content = newNote.content[selectedNode.uuid];
      content.name = name;

      return newNote;
    });
  }

  return {
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
}

function _saveNoteToDb(note: NoteProjectType) {
  localStorage.setItem(`note-${note.uuid}`, JSON.stringify(note));
}
