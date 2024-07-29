import { invoke } from "@tauri-apps/api/tauri";

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
