import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IChatState {
  inputValue: string;
}

const defaultInitialState: IChatState = {
  inputValue: "",
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
  },
});

export const { setInputValue, appendToInputValue } = chatSlice.actions;

export default chatSlice.reducer;
