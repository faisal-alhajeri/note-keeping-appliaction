import React, { useState } from "react";
import { Button, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNotes } from "../db/db";

export default function AllNotes() {
  const [searchWord, setSearchWord] = useState("");
  const { noteMap } = useNotes();

    console.log(noteMap["asdsad"]);
    console.log(
      JSON.parse(

        localStorage.getItem(`note-${noteMap["asdsad"]}`)!
      )
    );
    

  return (
    <>
      <Container className="d-flex flex-column justify-content-left align-items-center my-5">
        <input
          style={{ maxWidth: "400px" }}
          onChange={(e) => setSearchWord(e.target.value)}
          value={searchWord}
        />
        <div style={{minHeight: '400px'}} className="bg-light border m-3 w-100 p-5 position-relative">
          {
            Object.keys(noteMap).map((name) => {
              const uuid = noteMap[name]
              return (
                <li key={uuid}>
                  <Link to={`/${uuid}`}>{name}</Link>
                </li>
              );
  
            })
          }

          <Link style={{position: 'absolute', right: '50px', top: '20px'}} to={"/create"}>
            <Button variant="outline-primary">Create New</Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
