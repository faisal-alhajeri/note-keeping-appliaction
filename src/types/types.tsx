export type imageType = {
    uuid: string
    src: string
}

export type NoteFileType = {
    uuid: string
    name: string
    body?: string
    images: imageType[]
    parent?: uuid
}
export type uuid = string

export type NoteDirType = {
    uuid: string
    name: string,
    directories: uuid[],
    files: uuid[],
    parent?: uuid
}

export type NoteChildType = NoteDirType | NoteFileType

export function isNoteDir(node: NoteDirType | NoteFileType): node is NoteDirType{
    return (node as NoteDirType).directories !== undefined;
}

export type NoteProjectType = {
    uuid: string
    name: string,
    root: uuid,
    content: {
        [uuid: uuid] : NoteChildType
    }
}

export type NoteNameUUIDMap = {
    [name: string] : string
}