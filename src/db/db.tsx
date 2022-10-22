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
import React, { useEffect, useMemo, useState } from "react";

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
      hide: false,
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

  // note map will be an array that have the nodes sorted by order
  // hidden nodes will not be in the map
  // once node is being shown then the note map will be recalculated

  const noteMap = useMemo(() => {
    let map = _NoteMap();
    console.log('-------------------------');
    console.log('current: ',selectedNode.name);
    map.forEach(uuid => {
      console.log(getNode(uuid).name,uuid);
    })
    console.log('-------------------------');

    return map;
  }, [note]);

  function _dir(node: NoteFileType | NoteDirType): NoteDirType {
    return node as NoteDirType;
  }

  function _file(node: NoteFileType | NoteDirType): NoteFileType {
    return node as NoteFileType;
  }

  function _isRoot(node: NoteFileType | NoteDirType): boolean {
    return node.parent === undefined;
  }

  function _Parent(node: NoteFileType | NoteDirType): NoteDirType | undefined {
    return _isRoot(node) ? undefined : (getNode(node.parent!) as NoteDirType);
  }

  function _hasDirectories(node: NoteFileType | NoteDirType): boolean {
    return isNoteDir(node) ? _dir(node).directories.length > 0 : false;
  }

  function _hasFiles(node: NoteFileType | NoteDirType): boolean {
    return isNoteDir(node) ? _dir(node).files.length > 0 : false;
  }

  function _isHidden(node: NoteFileType | NoteDirType): boolean {
    return isNoteDir(node) ? _dir(node).hide : true;
  }

  useEffect(() => {
    _unhideParentCahin(selectedUUID);
  }, [selectedUUID]);

  function getNode(nodeUUID: uuid): NoteFileType | NoteDirType {
    if (nodeUUID in note.content) {
      return note.content[nodeUUID];
    } else {
      return note.content[note.root];
    }
  }

  function _unhideParentCahin(uuid: string) {
    getParentChain(uuid)
      .map((uuid) => getNode(uuid))
      .forEach((node) => {
        if (isNoteDir(node) && uuid !== node.uuid) {
          node.hide = false;
        }
      });

    const newNote = { ...note };
    setNote(newNote);
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
      hide: false,
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

  function renameSelected(name: string) {
    selectedNode.name = name;
    setNote((oldNote) => {
      const newNote = { ...oldNote };
      const content = newNote.content[selectedNode.uuid];
      content.name = name;

      return newNote;
    });
  }

  function toggleHide(uuid: uuid) {
    const node = getNode(uuid);
    if (!isNoteDir(node)) return;
    node.hide = !node.hide;
    const newNote = { ...note };
    setNote(newNote);
  }

  function hide(uuid: uuid) {
    const node = getNode(uuid);
    if (!isNoteDir(node)) return;
    node.hide = true;
    const newNote = { ...note };
    setNote(newNote);
  }

  function show(uuid: uuid) {
    const node = getNode(uuid);
    if (!isNoteDir(node)) return;
    node.hide = false;
    const newNote = { ...note };
    setNote(newNote);
  }

  // note map will be an array that have the nodes sorted by order
  // hidden nodes will not be in the map
  // once node is being shown then the note map will be recalculated
  function _NoteMap(): uuid[] {
    const res: uuid[] = [];

    function _travese(node: NoteDirType) {
      res.push(node.uuid);
      if (!node.hide) {
        node.directories.forEach((dir) =>
          _travese(getNode(dir) as NoteDirType)
        );
        node.files.forEach((file) => res.push(file));
      }
    }

    _travese(getNode(note.root) as NoteDirType);

    return res;
  }

  function selectNext() {
    const idxOfSelected = noteMap.indexOf(selectedNode.uuid);

    if (idxOfSelected === -1) return _unhideParentCahin(selectedNode.uuid);

    if (idxOfSelected === noteMap.length - 1) return;



    setSelectedUUID(noteMap[idxOfSelected + 1]);
  }

  function selectPrev() {
    const idxOfSelected = noteMap.indexOf(selectedNode.uuid);
    if (idxOfSelected === -1) return _unhideParentCahin(selectedNode.uuid);

    if (idxOfSelected === 0) return;

    setSelectedUUID(noteMap[idxOfSelected - 1]);
  }

  return {
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
  };
}

function _saveNoteToDb(note: NoteProjectType) {
  localStorage.setItem(`note-${note.uuid}`, JSON.stringify(note));
}

export function useNoteNodeBody(note: NoteProjectType, node: NoteFileType) {
  const { state: body, setState: setBody } = useLocalStorage<string>(
    `note-${note.uuid}-${node.uuid}-body`,
    ""
  );

  return { body, setBody };
}

export function useNoteNodeimages(note: NoteProjectType, node: NoteFileType) {
  const { state: images, setState: setImages } = useLocalStorage<string[]>(
    `note-${note.uuid}-${node.uuid}-body`,
    []
  );

  return { images, setImages };
}

// TODO: craete keyboard controls
export function useControls() {}
