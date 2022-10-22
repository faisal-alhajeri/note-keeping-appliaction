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
            <Row style={{ height: "100%", width: "100%", margin: "0px" }}>
              <Col id="project-tree-column" xs={3} className="">
                <NoteTreeContainer />
              </Col>
              <Col id="project-note-column" xs={9} className="">
                <NoteContentContainer />
              </Col>
            </Row>
          </div>
        </SingleNoteProvider>
      )}
    </>
  );
}
