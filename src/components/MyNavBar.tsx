import React from "react";
import { Navbar } from "react-bootstrap";

export default function MyNavBar() {
  return (
    <Navbar bg="dark" variant="dark" className="py-3 px-5 my-nav">
      <Navbar.Brand >Notes</Navbar.Brand>
    </Navbar>
  );
}
