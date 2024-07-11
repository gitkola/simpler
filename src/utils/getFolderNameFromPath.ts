export const getFolderNameFromPath = (folderPath: string): string => {
  return folderPath.split("/").pop() || "";
};
