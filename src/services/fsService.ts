import { invoke } from "@tauri-apps/api/tauri";
import { join } from "@tauri-apps/api/path";
import store from "../store"; //TODO: is this OK to use store in utils?

export const openFolder = async (path: string | null) => {
  try {
    if (!path) throw new Error("No project path provided");
    await invoke("open_folder", { path });
  } catch (error) {
    console.error("Failed to open project folder:", error);
  }
};

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
    await invoke("write_file", {
      path: fullPath,
      content: code || "",
    });
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

export const readFile = async (path: string | null): Promise<string> => {
  try {
    if (!path) throw new Error("No path to read file from");
    const content: string = await invoke("read_file", { path });
    return content || "";
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};

type Path = string;
type Content = string;

interface IFile {
  path: Path;
  content?: Content | null;
}

export async function readFiles(paths: Path[]): Promise<IFile[]> {
  const files: IFile[] = [];
  const activeProjectPath = store.getState().projects.activeProjectPath;
  if (!activeProjectPath) throw new Error("No active project path");

  for await (const path of paths) {
    try {
      const fullPath = await join(
        activeProjectPath,
        path || `/${generateDefaultFileName()}`
      );
      const content: string = await readFile(fullPath);
      files.push({ path, content });
    } catch (error) {
      console.error(`Failed to read file by path '${path}'`, error);
    }
  }
  return files;
}

type FileUpdateStatus = "saved" | "deleted" | "error";

interface IUpdatedFile {
  path: Path;
  status: FileUpdateStatus;
  error?: any;
}

export async function updateFiles(files: IFile[]): Promise<IUpdatedFile[]> {
  const updatedFilesStatuses: IUpdatedFile[] = [];
  for await (const { path, content } of files) {
    try {
      if (!content) {
        await writeFile(null, path);
        updatedFilesStatuses.push({ path, status: "deleted" });
      } else {
        await writeFile(content, path);
        updatedFilesStatuses.push({ path, status: "saved" });
      }
    } catch (error) {
      console.error(`Failed to update file by path '${path}'`, error);
      updatedFilesStatuses.push({ path, status: "error", error });
    }
  }
  return updatedFilesStatuses;
}
