import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import SingleNoteProvider from "../contexts/SingleNoteContext";
import FlashMssagesContainer from "../flash-messages/FlashMssagesContainer";
import NoteContentContainer from "../notes-components/content/NoteContentContainer";
import NoteTreeContainer from "../notes-components/tree/NoteTreeContainer";

export default function Note() {
  const { uuid } = useParams();

  return (
    <>
      {uuid && (
        <SingleNoteProvider noteUUID={uuid}>
          <div id="note-container">
            <FlashMssagesContainer />
            <div id="project-tree-column" className="">
              <NoteTreeContainer />
            </div>
            <div id="project-note-column" className="">
                <NoteContentContainer />
            </div>
          </div>
        </SingleNoteProvider>
      )}
    </>
  );
}
