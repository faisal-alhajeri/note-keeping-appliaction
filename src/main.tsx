import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import NotesProvider from "./contexts/NotesContext";
import { FlashMessegesProvider } from "./flash-messages/context/FlashMessegesContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FlashMessegesProvider>
        <App />
      </FlashMessegesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
