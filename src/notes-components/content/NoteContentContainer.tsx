import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Ratio, Row } from "react-bootstrap";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { useNoteNodeBody, useNoteNodeimages } from "../../db/db";
import { isNoteDir, NoteFileType, NoteProjectType } from "../../types/types";
import "./NoteContent.css"
import NoteImage from "./NoteImage";

type props = {
  note: NoteProjectType;
};

export default function NoteContentContainer() {
  const { note, selectedNode, selectNode, getParentChain, getNode } =
    useSingleNoteContext();
  const { body, setBody } = useNoteNodeBody(note, selectedNode as NoteFileType);
  const { images, saveImage, deleteImage } = useNoteNodeimages(note, selectedNode as NoteFileType);
  const isDir = useMemo(() => isNoteDir(selectedNode), [selectedNode]);
  const uploadImagesRef = useRef<HTMLInputElement>(null)


  function handleUploadImages(e:React.ChangeEvent<HTMLInputElement>){


    for(const file of e.target.files!) {
      const reader = new FileReader()
      reader.onload = () => {
        saveImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

  }

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
          <textarea
            id="node-text-input"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div id="node-images-input">
            <input onChange={handleUploadImages} accept='image/*' type={'file'} multiple ref={uploadImagesRef}/>
            <Row xs={2} >
            {
              images.map(image => {
                return (
                  <Col key={`image-${image.uuid}`}>
                    <NoteImage onDelete={deleteImage}  image={image} />
                  
                  </Col>
                )
              })
            }
            </Row>

          </div>
        </>
      )}
    </>
  );
}
