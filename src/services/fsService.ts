import { invoke } from "@tauri-apps/api/tauri";
import { join } from "@tauri-apps/api/path";
import store from "../store"; //TODO: is this OK to use store in utils?
import { getFilteredProjectFiles } from "@/lib/utils/getFilteredProjectFiles";
import { IProjectFile } from "../types";

export const openFolder = async (path: string | null) => {
  try {
    if (!path) throw new Error("No project path provided");
    await invoke("open_folder", { path });
  } catch (error) {
    console.error("Failed to open project folder:", error);
  }
};

export const selectFile = async () => {
  try {
    const activeProjectPath = store.getState().projects.activeProjectPath;
    if (!activeProjectPath) throw new Error("No active project path");
    const selectedFile = await invoke<string>("select_file", {
      folderPath: activeProjectPath
    });
    return selectedFile;
  } catch (error) {
    console.error("Failed to select file:", error);
    return null;
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

export const writeFile = async (
  content: string | null,
  path: string | null
) => {
  try {
    const fullPath = await getFullFilePath(path);
    await invoke("write_file", {
      path: fullPath,
      content: content || "",
    });
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

export const readFile = async (path: string | null): Promise<string> => {
  try {
    if (!path) throw new Error("No path to read file from");
    const content: string = await invoke("read_file", { path });
    console.log("Read file content:", content);

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
  for await (const path of paths) {
    try {
      const fullPath = await getFullFilePath(path);
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

export const readFilesFromFS = async (projectPath: string) => {
  try {
    if (typeof projectPath !== "string" || !projectPath) return null;
    const filteredFilePaths = await getFilteredProjectFiles(projectPath, true);
    const projectFiles: IProjectFile[] = [];
    for await (const filePath of filteredFilePaths) {
      try {
        const fileContent = await invoke<string>("read_file", {
          path: filePath,
        });
        const file: IProjectFile = {
          path: filePath.replace(`${projectPath}/`, ""),
          content: fileContent as string,
        };
        projectFiles.push(file);
      } catch (fileError) {
        console.warn(
          `Skipping file ${filePath}: ${JSON.stringify(
            fileError as Error,
            null,
            2
          )}`
        );
        // Optionally, you can still add the file to projectFiles with empty content
        // projectFiles.push({ path: filePath, content: '' });
      }
    }
    return projectFiles;
  } catch (error) {
    const errorMessage = `Failed to read files from the selected folder: ${(error as Error).message
      }`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const getFullFilePath = async (path: string | null) => {
  const activeProjectPath = store.getState().projects.activeProjectPath;
  if (!activeProjectPath) throw new Error("No active project path");
  const fullPath = await join(
    activeProjectPath,
    path || `/${generateDefaultFileName()}`
  );
  return fullPath;
};
