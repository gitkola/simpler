import { z } from "zod";
import { tool } from "ai";
import { IProjectFile } from "../types";

export interface IGetProjectStateFilesParams {
  paths: string[];
}

export const defineGetProjectStateFiles = (getProjectStateFiles: (params: IGetProjectStateFilesParams) => Promise<{ files: IProjectFile[] }>) => tool({
  description:
    "Retrieves the contents of multiple project files given their relative paths. Returns an array of objects containing file paths and their contents.",
  parameters: z.object({
    paths: z
      .array(z.string().describe("Relative path to a project file."))
      .describe("Array of relative file paths within the project.")
      .min(1),
  }),
  execute: getProjectStateFiles,
});
