import React, { useEffect, useMemo, useState } from "react";
import { useSingleNoteContext } from "../../contexts/SingleNoteContext";
import { isNoteDir, NoteProjectType } from "../../types/types";

type props = {
  note: NoteProjectType;
};

export default function NoteContentContainer() {
  const {
    note,
    selectedNode,
    selectNode,
    getParentChain,
    getNode,
    updateText,
  } = useSingleNoteContext();

  useEffect(() => {
    function handler(e: KeyboardEvent){
      if(e.ctrlKey && e.altKey && e.key === 'a'){

        console.log(e.key);
      }
      
    }  

    document.addEventListener('keydown', handler)

    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isDir = useMemo(() => isNoteDir(selectedNode), [selectedNode]);

  const [text, setText] = useState(() => {
    return isNoteDir(selectedNode) ? "" : selectedNode.body;
  });

  function _formatPath() {
    const chain = getParentChain(selectedNode.uuid);
    return chain.map((uuid, idx, list) => {
      const node = getNode(uuid)

      return (
        <>
          <span className="px-2" onClick={() => selectNode(node)}>
            {
              idx !== 0? node.name : note.name
            }
          </span>
          {list.length - 1 !== idx && <span className="px-3">&#8594;</span>}
        </>
      );
    });
  }


  return (
    <>
      <div className="bg-secondary p-2 text-light">{_formatPath()}</div>

      {!isNoteDir(selectedNode) && (
        <textarea
          id="node-text-input"
          value={selectedNode.body}
          onChange={updateText}
        />
      )}
    </>
  );
}
