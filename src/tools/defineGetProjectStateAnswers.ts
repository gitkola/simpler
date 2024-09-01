import { z } from "zod";
import { tool } from "ai";

export const defineGetProjectStateAnswers = () =>
  tool({
    description:
      "Gets the array of questions about the task or project. Returns an array of answers.",
    parameters: z.object({ questions: z.array(z.string()) }),
  });
