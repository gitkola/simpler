export const getFolderNameFromPath = (folderPath: string | null): string => {
  if (!folderPath) return "";
  return folderPath.split("/").pop() || "";
};
