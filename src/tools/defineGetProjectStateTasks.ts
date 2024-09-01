import { z } from "zod";
import { tool } from "ai";
import { IProjectTask } from "../types";

export const defineGetProjectStateTasks = (
  getProjectStateTasks: () => Promise<{ tasks: IProjectTask[] }>
) =>
  tool({
    description:
      "Retrieves the project tasks without requiring any input. Returns the project tasks as an array of objects, each containing a task description and its current status.",
    parameters: z.object({}),
    execute: getProjectStateTasks,
  });
