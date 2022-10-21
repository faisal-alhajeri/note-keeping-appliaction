import useLocalStorage from "../hooks/useLocalStorage";
import { NoteDirType, NoteNameUUIDMap, NoteProjectType, uuid } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export function useNotes() {
  const {
    state: noteMap,
    setState: _setNoteMap,
  } = useLocalStorage<NoteNameUUIDMap>("notes-map", {} as NoteNameUUIDMap);

  async function createNewNote(name: string): Promise<boolean> {
    if(noteMap[name] !== undefined) return false
    

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

    await new Promise(r => setTimeout(r, 1000));


    return true
  }

  function deleteNote(name: string){
    const noteUUID = noteMap[name]
    localStorage.removeItem(`note-${noteUUID}`)

    _setNoteMap(old => {
        const newNoteMap = {
            ...old
        }
        delete newNoteMap[name]
        return newNoteMap
    })
  }

  return { noteMap, createNewNote, deleteNote };
}

export function useSingleNote(uuid: string) {
  const {
    state: note,
    setState: setNote,
    save: _saveNote,
  } = useLocalStorage<NoteProjectType>(`note-${uuid}`, {} as NoteProjectType);

  function saveNote() {}

  return {note}

}

function _saveNoteToDb(note: NoteProjectType) {
  localStorage.setItem(`note-${note.uuid}`, JSON.stringify(note));
}

// export function saveNote(note: NoteProjectType){
//     const oldNote = notes.find((note) => note.uuid === newNote.uuid);

//     if (oldNote === undefined) {
//       setNotes((oldNotes) => {
//         return [...oldNotes, newNote];
//       });
//     } else {
//       setNotes((oldNotes) => {
//         return oldNotes.map((note) => {
//           if (note.uuid === newNote.uuid) return newNote;
//           return note;
//         });
//       });
//     }

// }
