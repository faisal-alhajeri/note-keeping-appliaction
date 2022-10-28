import React, { useState } from "react";
import { Button, Col, Container, InputGroup, NavLink, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useNotes } from "../db/db";

export default function AllNotes() {
  const [searchWord, setSearchWord] = useState("");
  const { noteMap } = useNotes();
  const navigate = useNavigate()
  return (
    <>
      <Container className="d-flex flex-column justify-content-left align-items-center my-5">
        {/* TODO: implement search feature */}

        <input
          style={{ maxWidth: "400px" }}
          onChange={(e) => setSearchWord(e.target.value)}
          value={searchWord}
          className='form-control'
        />

        <div
          style={{ minHeight: "400px" }}
          className="bg-light border m-3 w-100 p-5 position-relative"
        >
          <Row xs={4}>
            {Object.keys(noteMap)
            .filter((name) => searchWord.length === 0 || name.includes(searchWord))
            .map((name) => {
              const uuid = noteMap[name];
              return (
                <Col className="g-3" key={uuid}>
                  <button onClick={() => navigate(`/${uuid}/info`)} className="fs-4 w-100 h-100 p-5 note-open-button">{name}</button>
                </Col>
              );
            })}
          </Row>
          <Link
            style={{ position: "absolute", right: "50px", top: "20px" }}
            to={"/create"}
          >
            <Button variant="outline-primary">Create New</Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
