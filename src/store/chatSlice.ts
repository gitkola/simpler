import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export interface IChatState {
  inputValue: string;
  messages: Anthropic.Message[] | OpenAI.ChatCompletionMessage[];
}

const defaultInitialState: IChatState = {
  inputValue: "",
  messages: [],
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
    setMessages: (state, action: PayloadAction<IChatState["messages"]>) => {
      state.messages = action.payload;
    },
  },
});

export const { setInputValue, appendToInputValue } = chatSlice.actions;

export default chatSlice.reducer;
