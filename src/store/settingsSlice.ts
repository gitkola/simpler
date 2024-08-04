import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AI_INSTRUCTIONS_PROJECT_STATE,
  AI_INSTRUCTIONS_RESPONSE_GUIDELINES,
  AI_INSTRUCTIONS_RESPONSIBILITIES,
  LOCAL_STORAGE_KEY_SETTINGS,
} from "../constants";

export interface SettingsState {
  apiKeys: {
    openai: string;
    anthropic: string;
  };
  instructions: {
    responsibilitiesInstructions: string;
    responseGuidelinesInstructions: string;
    projectStateInstructions: string;
  };
  styles: string;
  theme: "light" | "dark";
  showDiff: boolean;
}

const defaultInitialState: SettingsState = {
  apiKeys: {
    openai: "",
    anthropic: "",
  },
  instructions: {
    responsibilitiesInstructions: AI_INSTRUCTIONS_RESPONSIBILITIES,
    responseGuidelinesInstructions: AI_INSTRUCTIONS_RESPONSE_GUIDELINES,
    projectStateInstructions: AI_INSTRUCTIONS_PROJECT_STATE,
  },
  styles: "",
  theme: "dark",
  showDiff: false,
};

const loadInitialState = (): SettingsState => {
  const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return defaultInitialState;
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadInitialState(),
  reducers: {
    setApiKey: (
      state,
      action: PayloadAction<{ service: "openai" | "anthropic"; key: string }>
    ) => {
      state.apiKeys[action.payload.service] = action.payload.key;
    },
    setResponsibilitiesInstructions: (state, action: PayloadAction<string>) => {
      state.instructions.responsibilitiesInstructions = action.payload;
    },
    setResponseGuidelinesInstructions: (
      state,
      action: PayloadAction<string>
    ) => {
      state.instructions.responseGuidelinesInstructions = action.payload;
    },
    setProjectStateInstructions: (state, action: PayloadAction<string>) => {
      state.instructions.projectStateInstructions = action.payload;
    },
    resetToDefaultInstructions: (state) => {
      state.instructions = { ...defaultInitialState.instructions };
    },
    setStyles: (state, action: PayloadAction<string>) => {
      state.styles = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setShowDiff: (state, action: PayloadAction<boolean>) => {
      state.showDiff = action.payload;
    },
  },
});

export const {
  setApiKey,
  setResponsibilitiesInstructions,
  setResponseGuidelinesInstructions,
  setProjectStateInstructions,
  resetToDefaultInstructions,
  setStyles,
  setTheme,
  setShowDiff,
} = settingsSlice.actions;

export default settingsSlice.reducer;
