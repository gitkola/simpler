import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import settingsReducer from "./settingsSlice";
import projectsReducer from "./projectsSlice";
import currentProjectReducer from "./currentProjectSlice";
import layoutReducer from "./layoutSlice";
// import fileTreeReducer from "../components/FileTree/useFileTree";
// import flatFileTreeReducer from "../components/FileTree/useFlatFileTree";
import { persistSettingsMiddleware } from "./persistSettingsMiddleware";
import { persistProjectsMiddleware } from "./persistProjectsMiddleware";
import { persistLayoutMiddleware } from "./persistLayoutMiddleware";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    projects: projectsReducer,
    currentProject: currentProjectReducer,
    layout: layoutReducer,
    // fileTree: fileTreeReducer,
    // flatFileTree: flatFileTreeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: true,
      immutableCheck: true,
      actionCreatorCheck: true,
    })
      .concat(persistSettingsMiddleware)
      .concat(persistProjectsMiddleware)
      .concat(persistLayoutMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
