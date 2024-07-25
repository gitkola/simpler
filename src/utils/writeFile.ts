import { invoke } from "@tauri-apps/api/tauri";
import { join } from "@tauri-apps/api/path";
import store from "../store"; //TODO: is this OK to use store in utils?

export const generateDefaultFileName = (fileExtension?: string) => {
  const date = new Date();
  const fileName = `file_${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${fileExtension || "txt"}`;
  return fileName;
};

export const writeFile = async (code: string | null, path: string | null) => {
  try {
    const activeProjectPath = store.getState().projects.activeProjectPath;
    if (!activeProjectPath) throw new Error("No active project path");
    const fullPath = await join(
      activeProjectPath,
      path || `/${generateDefaultFileName()}`
    );
    await invoke("write_file", { path: fullPath, content: code || "" });
  } catch (error) {
    console.error("Error saving file:", error);
  }
};
