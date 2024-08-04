import { IFileTreeState, SelectionState } from "./fileTreeInterfaces"; // Assuming we're using the same interface

export function pathsToTreeObject(paths: string[]): IFileTreeState {
  if (paths.length === 0) {
    throw new Error("No paths provided");
  }

  // Extract the root directory name from the first path
  const rootDirName = paths[0].split("/")[0];

  // Verify that all paths start with the same root directory
  if (!paths.every((path) => path.startsWith(rootDirName + "/"))) {
    throw new Error("All paths must start with the same root directory");
  }

  const root: IFileTreeState = {
    path: rootDirName,
    isFolder: true,
    children: [],
    selected: SelectionState.None,
  };

  paths.forEach((path) => {
    // Remove the root directory from the path
    const relativePath = path.substring(rootDirName.length + 1);
    const parts = relativePath.split("/");
    let currentNode = root;

    parts.forEach((_, index) => {
      const isLastPart = index === parts.length - 1;
      const fullPath = `${rootDirName}/${parts.slice(0, index + 1).join("/")}`;
      let child = currentNode.children?.find((c) => c.path === fullPath);

      if (!child) {
        child = {
          path: fullPath,
          isFolder: !isLastPart,
          children: isLastPart ? undefined : [],
          selected: SelectionState.None,
        };
        currentNode.children?.push(child);
      }

      currentNode = child;
    });
  });

  return root;
}

// Helper function to add selection state to the tree
export function addSelectionState(tree: IFileTreeState): IFileTreeState {
  return {
    ...tree,
    selected: SelectionState.None,
    children: tree.children?.map(addSelectionState),
  };
}

// Usage example
// const paths = [
//   "folder1/subfolder1/file1.txt",
//   "folder1/subfolder1/file2.txt",
//   "folder1/subfolder2/file3.txt",
//   "folder2/file4.txt",
//   "file5.txt",
// ];

// const treeObject = pathsToTreeObject(paths);
// const treeStateObject = addSelectionState(treeObject);

// console.log(JSON.stringify(treeStateObject, null, 2));
