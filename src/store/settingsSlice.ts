import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_SETTINGS } from "../constants";

export interface SettingsState {
  apiKeys: {
    openai: string;
    anthropic: string;
  };
}

const defaultInitialState: SettingsState = {
  apiKeys: {
    openai: "",
    anthropic: "",
  },
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
  },
});

export const { setApiKey } = settingsSlice.actions;

export default settingsSlice.reducer;
