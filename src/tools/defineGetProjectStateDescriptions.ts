import { z } from "zod";
import { tool } from "ai";
import { IProjectDescription } from "../types";

export const defineGetProjectStateDescriptions = (
  getProjectStateDescriptions: () => Promise<{
    descriptions: IProjectDescription[];
  }>
) =>
  tool({
    description:
      "Gets the project descriptions without requiring any input. Returns an array of description objects.",
    parameters: z.object({}),
    execute: getProjectStateDescriptions,
  });
