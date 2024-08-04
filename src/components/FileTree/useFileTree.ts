import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFileTreeState, SelectionState } from "./fileTreeInterfaces";
import { pathsToTreeObject, addSelectionState } from "./pathToTreeObject";

// Assume this is your Redux slice
const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState: {} as IFileTreeState,
  reducers: {
    initializeFileTree: (_, action: PayloadAction<string[]>) => {
      if (action.payload.length === 0) {
        return {} as IFileTreeState;
      }
      const treeObject = pathsToTreeObject(action.payload);
      return addSelectionState(treeObject);
    },
    toggleFolder: (state, action: PayloadAction<string>) => {
      const toggleNode = (node: IFileTreeState) => {
        if (node.path === action.payload) {
          node.isOpen = !node.isOpen;
          return true;
        }
        if (node.children) {
          for (const child of node.children) {
            if (toggleNode(child)) return true;
          }
        }
        return false;
      };
      toggleNode(state);
    },
    setSelection: (
      state,
      action: PayloadAction<{ path: string; selectionState: SelectionState }>
    ) => {
      const { path, selectionState } = action.payload;
      const updateSelection = (node: IFileTreeState): SelectionState => {
        if (node.path === path) {
          node.selected = selectionState;
          if (node.children) {
            node.children.forEach((child) => {
              updateSelection(child);
            });
          }
          return selectionState;
        }
        if (node.children) {
          const childStates = node.children.map(updateSelection);
          if (childStates.every((state) => state === SelectionState.Full)) {
            node.selected = SelectionState.Full;
          } else if (
            childStates.some((state) => state !== SelectionState.None)
          ) {
            node.selected = SelectionState.Partial;
          } else {
            node.selected = SelectionState.None;
          }
        }
        return node.selected;
      };
      updateSelection(state);
    },
  },
});

export const { initializeFileTree, toggleFolder, setSelection } =
  fileTreeSlice.actions;
export default fileTreeSlice.reducer;

export const useFileTree = () => {
  const dispatch = useDispatch();
  const fileTree = useSelector(
    (state: { fileTree: IFileTreeState }) => state.fileTree
  );

  const handleToggle = useCallback((path: string) => {
    dispatch(toggleFolder(path));
  }, []);

  const handleSelect = useCallback(
    (path: string, selectionState: SelectionState) => {
      console.log("handleSelect1", { path, selectionState });

      dispatch(setSelection({ path, selectionState }));
    },
    []
  );

  // Memoize the stable part of the return value
  const stableReturnValue = useMemo(
    () => ({
      handleToggle,
      handleSelect,
    }),
    [handleToggle, handleSelect]
  );

  // Combine the stable part with the parts that may change more frequently
  return {
    ...stableReturnValue,
    fileTree,
    getSelectedFiles: useCallback(() => {
      const selected: string[] = [];
      const traverse = (node: IFileTreeState) => {
        if (!node.isFolder && node.selected === SelectionState.Full) {
          selected.push(node.path);
        }
        if (node.children) {
          node.children.forEach(traverse);
        }
      };
      traverse(fileTree);
      return selected;
    }, [fileTree]),
  };
};
