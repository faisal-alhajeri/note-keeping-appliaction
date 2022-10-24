import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Ratio, Row } from "react-bootstrap";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { useNoteNodeBody, useNoteNodeimages } from "../../db/db";
import { isNoteDir, NoteFileType, NoteProjectType } from "../../types/types";
import ImageContainer from "./ImageContainer";
import "./NoteContent.css"
import NoteImage from "./NoteImage";
import TextEditor from "./TextEditor";

type props = {
  note: NoteProjectType;
};

export default function NoteContentContainer() {
  const { note, selectedNode, selectNode, getParentChain, getNode } =
    useSingleNoteContext();
  const isDir = useMemo(() => isNoteDir(selectedNode), [selectedNode]);
  

  function _formatPath() {
    const chain = getParentChain(selectedNode.uuid);
    return chain.map((uuid, idx, list) => {
      const node = getNode(uuid);

      return (
        <>
          <span
            key={`name-${uuid}`}
            className="px-2 d-inline-block"
            onClick={() => selectNode(node)}
          >
            {idx !== 0 ? node.name : note.name}
          </span>
          {list.length - 1 !== idx && (
            <span key={`arrow-${uuid}`} className="px-3">
              &#8594;
            </span>
          )}
        </>
      );
    });
  }

  return (
    <>
      <div className="bg-secondary p-2 text-light">{_formatPath()}</div>

      {!isNoteDir(selectedNode) && (
        <>
          <TextEditor />


          <ImageContainer />
        </>
      )}
    </>
  );
}
