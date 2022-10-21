import { faPlus, faMinus, faFile, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { NoteChildType, NoteDirType, NoteFileType } from "../../types/types";
import "./NoteTree.css";

type props = {
  node: NoteChildType;
  isDir?: boolean;
} & React.ComponentProps<'div'>;

export default function TreeFileDirSlot({ node, isDir = false,...props}: props) {
  const dirNode = node as NoteDirType;
  const fileNode = node as NoteFileType;
  const [hideDir, setHideDir] = useState(false);
  const {selectedNode ,selectNode} = useSingleNoteContext()  
// console.log(node);




  function toggleHide() {
    setHideDir((oldHide) => !oldHide);
  }

  // show the plus minus sign before directories
  function _showIcon() {
    return isDir;
    // return isDir && (dirNode.directories.length > 0 || dirNode.files.length > 0)
  }

  // show the child of dir based on conditions 
  function _showChild() {
    // return isDir;
    return isDir && !hideDir &&(dirNode.directories.length > 0 || dirNode.files.length > 0)
  }

  function _isSelected(){
    return node.uuid === selectedNode.uuid;
  }
  
  function gethideShowIcon() {
    return _showIcon() ? (
      hideDir ? (
        <FontAwesomeIcon icon={faPlus} size={"2xs"} onClick={toggleHide} />
      ) : (
        <FontAwesomeIcon icon={faMinus} size={"2xs"} onClick={toggleHide} />
      )
    ) : <FontAwesomeIcon icon={faFileAlt} size={"2xs"} />;
  }

  return (
    <div className="tree-node-container" {...props}>
      <span className={`tree-node-name ${_isSelected() ? 'selected-node': ''}`}>
      {gethideShowIcon()} <span onClick={() => selectNode(node)}>{node.name} </span>
      </span>
      {_showChild() && (
        <div className="tree-node-child">
          {dirNode.directories.map((dir) => {
            return <TreeFileDirSlot  key={dir.uuid} node={dir} isDir={true} />;
          })}

          {dirNode.files.map((f) => {
            return <TreeFileDirSlot key={f.uuid} node={f} />;
          })}
        </div>
      )}

    </div>
  );
}
