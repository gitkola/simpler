import { SelectionState } from "./fileTreeInterfaces";

export interface FileTreeEntry {
  selected: SelectionState;
  isFolder: boolean;
  isOpen?: boolean;
}

export interface IFlatFileTreeState {
  [path: string]: FileTreeEntry;
}

// Function to convert an array of paths to the flat file tree structure
export function pathsToFlatTree(paths: string[]): IFlatFileTreeState {
  const tree: IFlatFileTreeState = {};

  paths.forEach((path) => {
    // Add the file itself
    tree[path] = {
      selected: SelectionState.None,
      isFolder: false,
    };

    // Add all parent folders
    let parentPath = path.substring(0, path.lastIndexOf("/"));
    while (parentPath) {
      if (!tree[parentPath]) {
        tree[parentPath] = {
          selected: SelectionState.None,
          isFolder: true,
          isOpen: false,
        };
      }
      parentPath = parentPath.substring(0, parentPath.lastIndexOf("/"));
    }
  });

  return tree;
}

// Function to toggle a folder's open state
export function toggleFolder(
  tree: IFlatFileTreeState,
  path: string
): IFlatFileTreeState {
  if (tree[path] && tree[path].isFolder) {
    return {
      ...tree,
      [path]: {
        ...tree[path],
        isOpen: !tree[path].isOpen,
      },
    };
  }
  return tree;
}

// Function to set the selection state of a file or folder
export function setSelection(
  tree: IFlatFileTreeState,
  path: string,
  state: SelectionState
): IFlatFileTreeState {
  const updatedTree = { ...tree };

  // Update the selected item
  updatedTree[path] = {
    ...updatedTree[path],
    selected: state,
  };

  // If it's a folder, update all children
  if (updatedTree[path].isFolder) {
    Object.keys(updatedTree).forEach((key) => {
      if (key.startsWith(path + "/")) {
        updatedTree[key] = {
          ...updatedTree[key],
          selected: state,
        };
      }
    });
  }

  // Update parent folders
  let parentPath = path.substring(0, path.lastIndexOf("/"));
  while (parentPath) {
    const childPaths = Object.keys(updatedTree).filter(
      (key) => key.startsWith(parentPath + "/") && key !== parentPath
    );
    const childStates = childPaths.map(
      (childPath) => updatedTree[childPath].selected
    );

    if (childStates.every((s) => s === SelectionState.Full)) {
      updatedTree[parentPath].selected = SelectionState.Full;
    } else if (childStates.some((s) => s !== SelectionState.None)) {
      updatedTree[parentPath].selected = SelectionState.Partial;
    } else {
      updatedTree[parentPath].selected = SelectionState.None;
    }

    parentPath = parentPath.substring(0, parentPath.lastIndexOf("/"));
  }

  return updatedTree;
}

// Function to get all selected file paths
export function getSelectedFilePaths(tree: IFlatFileTreeState): string[] {
  return Object.entries(tree)
    .filter(
      ([_, entry]) => !entry.isFolder && entry.selected === SelectionState.Full
    )
    .map(([path, _]) => path);
}
