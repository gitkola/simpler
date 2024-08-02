export interface IFileTreeState {
  path: string;
  isFolder: boolean;
  isOpen?: boolean;
  children?: IFileTreeState[];
  selected: SelectionState;
}

export enum SelectionState {
  None = 0,
  Partial = 1,
  Full = 2,
}

export interface FileTreeProps {
  data?: IFileTreeState;
  onToggle: (path: string) => void;
  onSelect: (path: string, state: SelectionState) => void;
  onFileClick: (item: IFileTreeState) => void;
}

export interface FileTreeItemProps extends FileTreeProps {
  item: IFileTreeState;
}
