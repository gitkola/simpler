import { z } from "zod";
import { tool } from "ai";
import { IProjectRequirement } from "../types";

export const defineGetProjectStateRequirements = (
  getProjectStateRequirements: () => Promise<{
    requirements: IProjectRequirement[];
  }>
) =>
  tool({
    description:
      "Retrieves the project requirements without requiring any input. Returns an array of requirement objects.",
    parameters: z.undefined(),
    execute: getProjectStateRequirements,
  });
