import React from 'react'
import { useSingleNoteContext } from '../../contexts/SingleNoteContext'
import { NoteProjectType } from '../../types/types'

type props = {
    note: NoteProjectType
}


export default function NoteContentContainer() {
  const {selectedNode, getParentChain, getNode} = useSingleNoteContext()


  // console.log(se);
  
  return (
    <>
      <div className='bg-secondary p-2 text-light'>
          {getParentChain(selectedNode.uuid).map(uuid => {
            return <div>{getNode(uuid).name}</div>
          })}
      </div>
    </>
  )
}
