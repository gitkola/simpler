import { invoke } from "@tauri-apps/api/tauri";

export const openFolder = async (path: string | null) => {
  try {
    if (!path) throw new Error("No project path provided");
    await invoke("open_folder", { path });
  } catch (error) {
    console.error("Failed to open project folder:", error);
  }
};
