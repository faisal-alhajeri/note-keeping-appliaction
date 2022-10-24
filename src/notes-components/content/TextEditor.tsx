import React from "react";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { useNoteNodeBody } from "../../db/db";
import {
  NoteChildType,
  NoteFileType,
  NoteProjectType,
} from "../../types/types";
import ReactQuill from "react-quill";

export default function TextEditor() {
  const { note, selectedNode, hideImages } = useSingleNoteContext();
  const { body, setBody } = useNoteNodeBody(note, selectedNode as NoteFileType);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div id="node-text-input" className={`${!hideImages ? "scrollable" : ""}`}>
      <ReactQuill
        theme="snow"
        value={body}
        onChange={setBody}
        formats={formats}
        modules={modules}
      />
    </div>
  );
}
