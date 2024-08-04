import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectionState } from "./fileTreeInterfaces";

import {
  IFlatFileTreeState,
  getSelectedFilePaths,
  pathsToFlatTree,
  toggleFolder,
  setSelection,
} from "./flatFileTreeUtils";

const flatFileTreeSlice = createSlice({
  name: "flatFileTree",
  initialState: {} as IFlatFileTreeState,
  reducers: {
    initializeFlatFileTree: (_, action: PayloadAction<string[]>) => {
      return pathsToFlatTree(action.payload);
    },
    toggleFolderOpen: (state, action: PayloadAction<string>) => {
      return toggleFolder(state, action.payload);
    },
    setSelectionState: (
      state,
      action: PayloadAction<{ path: string; selectionState: SelectionState }>
    ) => {
      return setSelection(
        state,
        action.payload.path,
        action.payload.selectionState
      );
    },
  },
});

export const { initializeFlatFileTree, toggleFolderOpen, setSelectionState } =
  flatFileTreeSlice.actions;
export default flatFileTreeSlice.reducer;

export const useFlatFileTree = () => {
  const dispatch = useDispatch();
  const flatFileTree = useSelector(
    (state: { flatFileTree: IFlatFileTreeState }) => state.flatFileTree
  );

  const handleToggle = useCallback((path: string) => {
    dispatch(toggleFolderOpen(path));
  }, []);

  const handleSelect = useCallback(
    (path: string, selectionState: SelectionState) => {
      console.log("handleSelect", { path, selectionState });

      dispatch(setSelectionState({ path, selectionState }));
    },
    []
  );

  const getSelectedFiles = useCallback(
    () => getSelectedFilePaths(flatFileTree),
    [flatFileTree]
  );

  return {
    flatFileTree,
    handleToggle,
    handleSelect,
    getSelectedFiles,
  };
};
