import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import projectsReducer from "./projectsSlice";
import layoutReducer from "./layoutSlice";
import { persistSettingsMiddleware } from "./persistSettingsMiddleware";
import { persistProjectsMiddleware } from "./persistProjectsMiddleware";
import { persistLayoutMiddleware } from "./persistLayoutMiddleware";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    projects: projectsReducer,
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      persistSettingsMiddleware,
      persistProjectsMiddleware,
      persistLayoutMiddleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
