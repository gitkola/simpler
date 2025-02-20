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

export const getFileNameFromPath = (filePath: string | null): string => {
  if (!filePath) return "";
  return filePath.split("/").pop() || "";
};

export const getFileExtension = (filePath: string | null): string => {
  if (!filePath) return "";
  return filePath.split(".").pop() || "";
};

export function parseFilePathFromFirstLine(inputString: string): string {
  const firstLine = inputString.split('\n')[0].trim();
  const regex = /^(?:(?:\/\/|#)\s*)?(?:file:|path:?)?\s*(?:\/\*\s*)?([\w\-./]+)(?:\s*\*\/)?$/i;
  const match = firstLine.match(regex);
  if (match && match[1]) {
      const filePath = match[1].trim();
      if (/^[\w\-./]+$/.test(filePath)) {
          return filePath;
      }
  }
  return "";
}