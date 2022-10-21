import React from 'react'
import { useSingleNoteContext } from '../../contexts/SingleNoteContext'
import { NoteProjectType } from '../../types/types'

type props = {
    note: NoteProjectType
}


export default function NoteContentContainer() {
  const {selectedNode} = useSingleNoteContext()


  // console.log(se);
  
  return (
    <div>{selectedNode.name}</div>
  )
}
