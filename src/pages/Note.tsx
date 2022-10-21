import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import SingleNoteProvider from "../contexts/SingleNoteContext";
import NoteContentContainer from "../notes-components/content/NoteContentContainer";
import NoteTreeContainer from "../notes-components/tree/NoteTreeContainer";

export default function Note() {
  const { uuid } = useParams();
  const { getNote } = useNotes();
  const note = useMemo(() => getNote((uuid as string) ?? ""), [uuid]);
  const navigate = useNavigate();


  if (note === undefined) {
    navigate("/", { replace: true });
  }

  return (
    <>
      {note && (
        <SingleNoteProvider note={note}>
          <div id="note-container">
            <Row style={{ height: "100%", width: "100%", margin: "0px" }}>
              <Col id="project-tree-column" xs={3} className="border">
                <NoteTreeContainer />
              </Col>
              <Col id="project-note-column" xs={9} className="border">
                <NoteContentContainer />
              </Col>
            </Row>
          </div>
        </SingleNoteProvider>
      )}
    </>
  );
}
