import React, { useEffect } from 'react'
import { useSingleNoteContext } from '../../contexts/SingleNoteContext';

export default function useKeybordControls() {
  const {
    note,
    createFileForSelected,
    createDirForSelected,
    getNode,
    selectedNode,
    renameSelected,
    selectNext,
    selectPrev,
    show,
    hide,
    setReanameMode
  } = useSingleNoteContext();


  // Keybord Controls
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey && e.altKey) {
        switch (e.key) {
          case "ArrowDown":
            selectNext();
            break;

          case "ArrowUp":
            selectPrev();
            break;

          case "ArrowRight":
            show(selectedNode.uuid);
            break;

          case "ArrowLeft":
            hide(selectedNode.uuid);
            break;

          case "d":
            createDirForSelected("new folder");
            break;

          case "f":
            createFileForSelected("new file");
            break;

          case "r":
            setReanameMode(true);
            break;
        }
      }
    }

    document.onkeydown = handler;
    return () => {
      document.onkeydown = null;
    };
  }, [selectedNode, selectNext, selectPrev, createDirForSelected, createFileForSelected]);



  return null
}
