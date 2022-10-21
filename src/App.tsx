import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Navbar, NavbarBrand } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import AllNotes from "./pages/AllNotes";
import Note from "./pages/Note";
import MyNavBar from "./components/MyNavBar";
import NoteCreate from "./pages/NoteCreate";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MyNavBar />

      <Routes>
        <Route path="/" element={<AllNotes />} />
        <Route path="/create" element={<NoteCreate />} />
        <Route path="/:uuid" element={<Note />} />
      </Routes>
    </>
  );
}

export default App;
