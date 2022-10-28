export type ImageType = {
  uuid: string;
  src: string;
};

export type NoteFileType = {
  uuid: string;
  name: string;
  parent?: uuid;
};
export type uuid = string;

export type NoteDirType = {
  uuid: string;
  name: string;
  directories: uuid[];
  files: uuid[];
  hide: boolean;
  parent?: uuid;
};

export type NoteChildType = NoteDirType | NoteFileType;

export function isNoteDir(
  node: NoteDirType | NoteFileType
): node is NoteDirType {
  return (node as NoteDirType).directories !== undefined;
}

export type NoteProjectType = {
  uuid: string;
  name: string;
  root: uuid;
  content: {
    [uuid: uuid]: NoteChildType;
  };
};

export type NoteNameUUIDMap = {
  [name: string]: string;
};

// falsh messages

export enum messegesTypes {
  ERROR = "danger",
  SUCCESS = "success",
}

export type flashMessegeType = {
  id: string;
  messege: string;
  type: messegesTypes;
};

