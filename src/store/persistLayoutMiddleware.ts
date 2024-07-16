import { Middleware } from "redux";
import isEqual from "lodash/isEqual";
import { LOCAL_STORAGE_KEY_LAYOUT } from "../constants";

export const persistLayoutMiddleware: Middleware =
  (store) => (next) => (action) => {
    const prevLayout = store.getState().settings;
    const result = next(action);
    const { layout } = store.getState();
    if (!isEqual(prevLayout, layout)) {
      localStorage.setItem(LOCAL_STORAGE_KEY_LAYOUT, JSON.stringify(layout));
    }

    return result;
  };
