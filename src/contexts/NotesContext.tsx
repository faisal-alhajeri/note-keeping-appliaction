import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { NoteDirType, NoteFileType, NoteProjectType } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export type NotesCtxValues = {
  notes: NoteProjectType[];
  createNote: (name: string) => boolean;
  getNote: (uuid: string) => NoteProjectType | undefined;
  saveNote: (newNote: NoteProjectType) => void;
};

const ctx = React.createContext({} as NotesCtxValues);

export function useNotes() {
  return useContext(ctx);
}

export default function NotesProvider({ children }: { children: any }) {
  const { state: notes, setState: setNotes } = useLocalStorage<
    NoteProjectType[]
  >("notes", [] as NoteProjectType[]);

  function _generateSampleDir(
    name: string,
    directories: NoteDirType[] = [],
    files: NoteFileType[] = []
  ): NoteDirType {
    return {
      uuid: uuidv4(),
      name,
      directories,
      files,
    };
  }

  function _generateSampleFile(name: string, body: string = ""): NoteFileType {
    return {
      uuid: uuidv4(),
      name,
      body,
      images: [],
    };
  }

  function _generateNestedSampleDirs(name: string) {
    return [
      _generateSampleDir(
        `${name}: dir1`,
        [
          _generateSampleDir(
            `dir1 of dir1`,
            [_generateSampleDir("test")],
            [_generateSampleFile("file1 of dir1 of dir1")]
          ),
          _generateSampleDir(`dir2 of dir1`),
        ],
        [
          _generateSampleFile(`file1 of dir1`),
          _generateSampleFile(`file2 of dir1`),
          _generateSampleFile(`file3 of dir1`),
          _generateSampleFile(`file4 of dir1`),
        ]
      ),
      _generateSampleDir(
        `${name}: dir2`,
        [
          _generateSampleDir(`dir1 of dir2`),
          _generateSampleDir(`dir2 of dir2`, [
            _generateSampleDir(`dir1 of dir2 of dir2`),
          ]),
        ],
        [_generateSampleFile(`file1 of dir2`)]
      ),
    ];
  }

  function getNote(uuid: string): NoteProjectType | undefined {
    return notes.find((note) => note.uuid === uuid);
  }

  function createNote(name: string): boolean {
    const sameName = notes.find((note) => note.name === name);

    if (sameName) return false;

    const newProject: NoteProjectType = {
      uuid: uuidv4(),
      name,
      root: {
        uuid: uuidv4(),
        name: "__root",
        directories: [],
        files: [],
      },
    };

    setNotes((oldNotes) => {
      return [...oldNotes, newProject];
    });

    return true;
  }

  function saveNote(newNote: NoteProjectType) {
    const oldNote = notes.find((note) => note.uuid === newNote.uuid);

    if (oldNote === undefined) {
      setNotes((oldNotes) => {
        return [...oldNotes, newNote];
      });
    } else {
      setNotes((oldNotes) => {
        return oldNotes.map((note) => {
          if (note.uuid === newNote.uuid) return newNote;
          return note;
        });
      });
    }
  }

  const ctxValues = {
    notes,
    getNote,
    saveNote,
    createNote,
  };

  return <ctx.Provider value={ctxValues}>{children}</ctx.Provider>;
}
