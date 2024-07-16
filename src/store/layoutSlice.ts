import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";

export interface ILayoutState {
  projectStateViewWidth: number;
}

const defaultInitialState: ILayoutState = {
  projectStateViewWidth: 300,
};

const loadInitialState = (): ILayoutState => {
  const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY_LAYOUT);
  if (savedLayout) {
    return JSON.parse(savedLayout);
  }
  return defaultInitialState;
};

const layoutSlice = createSlice({
  name: "layout",
  initialState: loadInitialState(),
  reducers: {
    setProjectStateViewWidth: (state, action: PayloadAction<number>) => {
      state.projectStateViewWidth = action.payload;
    },
  },
});

export const { setProjectStateViewWidth } = layoutSlice.actions;

export default layoutSlice.reducer;
