export const getFolderNameFromPath = (folderPath: string | null): string => {
  if (!folderPath) return "";
  return folderPath.split("/").pop() || "";
};

export const getFolderNameFromFilePath = (filePath: string | null): string => {
  if (!filePath) return "";
  let arr = filePath.split("/");
  arr.pop();
  return arr.join("/");
};
