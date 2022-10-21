import React, { useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../db/db'

export default function NoteCreate() {
    const {createNewNote} = useNotes()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [err, setErr] = useState(false)

    async function save(e:any){
        e.preventDefault()
        setLoading((old) => true)
        const success = await createNewNote(name)

        if(success){
            // console.log('created');
            
            navigate('/', {replace: true})
        }  else {
            setErr(true)
        }
        setLoading((old) => false)

    }

    return (
    <>
    <form onSubmit={save} className='d-flex justify-content-center align-items my-5'>
        <div  >
        <h1 className='mb-5'>
            Create New Project
        </h1>

        <div className='d-flex flex-column justify-content-center align-items-center mb-5'>
            <div>
            <input className='mx-2' onChange={(e) => setName(e.target.value)} value={name}/> <Button disabled={loading} type='submit' className='mx-2' variant='outline-primary'>Create</Button>

            </div>
            <div style={{color: 'red'}}>
                {err && `name already exsists`}
            </div>

        </div>

        </div>
    </form>
    </>
  )
}
