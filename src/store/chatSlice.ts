import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IChatState {
  inputValue: string;
  addProjectStateToContext: boolean;
}

const defaultInitialState: IChatState = {
  inputValue: "",
  addProjectStateToContext: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: defaultInitialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    appendToInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue === ""
        ? (state.inputValue += action.payload)
        : (state.inputValue += `\n${action.payload}`);
    },
    setAddProjectStateToContext: (state, action: PayloadAction<boolean>) => {
      state.addProjectStateToContext = action.payload;
    },
  },
});

export const {
  setInputValue,
  appendToInputValue,
  setAddProjectStateToContext,
} = chatSlice.actions;

export default chatSlice.reducer;
