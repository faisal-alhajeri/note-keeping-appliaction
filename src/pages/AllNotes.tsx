import React, { useState } from "react";
import { Button, Col, Container, InputGroup, NavLink, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNotes } from "../db/db";

export default function AllNotes() {
  const [searchWord, setSearchWord] = useState("");
  const { noteMap } = useNotes();

  return (
    <>
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
          <Row xs={4}>
            {Object.keys(noteMap).map((name) => {
              const uuid = noteMap[name];
              return (
                <Col key={uuid}>
                  <Link className="fs-4" to={`/${uuid}`}>{name}</Link>
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
