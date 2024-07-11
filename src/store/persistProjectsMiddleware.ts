import { Middleware } from "redux";
import isEqual from "lodash/isEqual";
import { LOCAL_STORAGE_KEY_PROJECTS } from "../constants";

export const persistProjectsMiddleware: Middleware =
  (store) => (next) => (action) => {
    const prevProjects = store.getState().projects;
    const result = next(action);
    const { projects } = store.getState();
    if (!isEqual(prevProjects, projects)) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_PROJECTS,
        JSON.stringify(projects)
      );
    }

    return result;
  };
