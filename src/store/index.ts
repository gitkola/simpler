import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import projectsReducer from "./projectsSlice";
import { persistSettingsMiddleware } from "./persistSettingsMiddleware";
import { persistProjectsMiddleware } from "./persistProjectsMiddleware";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      persistSettingsMiddleware,
      persistProjectsMiddleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
