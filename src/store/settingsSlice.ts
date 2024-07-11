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

// Middleware to save settings to localStorage after each change
export const saveSettingsMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type.startsWith("settings/")) {
      const settingsState = store.getState().settings;
      localStorage.setItem(
        LOCAL_STORAGE_KEY_SETTINGS,
        JSON.stringify(settingsState)
      );
    }
    return result;
  };
