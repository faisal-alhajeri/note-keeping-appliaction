import {
  faPlus,
  faMinus,
  faFile,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import {
  isNoteDir,
  NoteChildType,
  NoteDirType,
  NoteFileType,
} from "../../types/types";
import "./NoteTree.css";

type props = {
  node: NoteChildType;
} & React.ComponentProps<"div">;

export default function TreeFileDirSlot({ node, ...props }: props) {
  const dirNode = node as NoteDirType;
  const fileNode = node as NoteFileType;
  const { selectedNode, selectNode, getNode, toggleHide } = useSingleNoteContext();
  // console.log(node);

  const isDir: boolean = isNoteDir(node);
  const isRoot: boolean = node.parent === undefined;



  // show the plus minus sign before directories
  function _showIcon() {
    return isDir;
    // return isDir && (dirNode.directories.length > 0 || dirNode.files.length > 0)
  }

  // show the child of dir based on conditions
  function _showChild() {
    // return isDir;
    return (
      isDir &&
      !dirNode.hide &&
      (dirNode.directories.length > 0 || dirNode.files.length > 0)
    );
  }

  function _isSelected() {
    return node.uuid === selectedNode.uuid;
  }

  function gethideShowIcon() {
    return _showIcon() ? (
      dirNode.hide ? (
        <FontAwesomeIcon
          className="pe-2"
          icon={faPlus}
          size={"2xs"}
          onClick={() => toggleHide(dirNode.uuid)}
        />
      ) : (
        <FontAwesomeIcon
          className="pe-2"
          icon={faMinus}
          size={"2xs"}
          onClick={() => toggleHide(dirNode.uuid)}
        />
      )
    ) : undefined;
  }

  function _showFileIcon() {
    return !isDir;
  }

  return (
    <div
      className="tree-node-container "

      {...props}
    >
      {!isRoot && (
        <span
          className={`tree-node-name ${_isSelected() ? "selected-node" : ""}`}
        >
          {gethideShowIcon()}{" "}
          <span onClick={() => selectNode(node)}>
            {_showFileIcon() && (
              <FontAwesomeIcon icon={faFileAlt} size={"2xs"} />
            )}{" "}
            {node.name}{" "}
          </span>
        </span>
      )}

      {_showChild() && (
        <div className={`tree-node-child ${!isRoot ? "show-node-child" : ""}`}>
          {dirNode.directories.map((dirUUID) => {
            return <TreeFileDirSlot key={dirUUID} node={getNode(dirUUID)} />;
          })}

          {dirNode.files.map((fileUUID) => {
            return <TreeFileDirSlot key={fileUUID} node={getNode(fileUUID)} />;
          })}
        </div>
      )}
    </div>
  );
}
