import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes, useSingleNote } from "../db/db";

export default function NoteInfo() {
  const { uuid } = useParams();
  const { note } = useSingleNote(uuid!);
  const { deleteNote } = useNotes();
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-left align-items-center my-5">
      {/* TODO: implement search feature */}

      {/* <input
      style={{ maxWidth: "400px" }}
      onChange={(e) => setSearchWord(e.target.value)}
      value={searchWord}
    /> */}

      <div
        style={{ minHeight: "400px" }}
        className="bg-light border m-3 w-100 p-5 position-relative"
      >
        <h1>{note.name}</h1>

        <Container className="d-flex flex-column align-items-center justify-content-around  h-100 my-5">
          <Button
            onClick={() => navigate(`/${note.uuid}`)}
            className="w-75 mt-5"
            variant="success"
          >
            Open
          </Button>
          <Button
            onClick={async () => {
              deleteNote(note.name);
              await new Promise((r) => setTimeout(r, 1000));
              navigate('/')
            }}
            className="w-75 mt-3"
            variant="outline-danger"
          >
            Delete
          </Button>
        </Container>
      </div>
    </Container>
  );
}
