import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import settingsReducer from "./settingsSlice";
import projectsReducer from "./projectsSlice";
import currentProjectReducer from "./currentProjectSlice";
import layoutReducer from "./layoutSlice";
import { persistSettingsMiddleware } from "./persistSettingsMiddleware";
import { persistProjectsMiddleware } from "./persistProjectsMiddleware";
import { persistLayoutMiddleware } from "./persistLayoutMiddleware";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    projects: projectsReducer,
    currentProject: currentProjectReducer,
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

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
