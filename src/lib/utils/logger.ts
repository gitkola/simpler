import { writeFile } from "@/services/fsService";

export const logToJSONFile = (name: string, data: any) => {
  try {
    const now = Date.now().toLocaleString();
    const fileName = `${now}-${name}.json`;
    const str = JSON.stringify(data, null, 2);
    console.log(fileName, data);
    writeFile(str, `.simpler/logs/${fileName}`);
  } catch (error) {
    console.error("Error logging to file:", error);
  }
};
