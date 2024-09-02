import { z } from "zod";
import { tool } from "ai";
import { IProjectState } from "../types";

export interface IUpdateProjectStateParams {
  ProjectStateUpdates: IProjectState;
}

export const defineUpdateProjectState = (
  updateProjectState: (
    params: IUpdateProjectStateParams
  ) => Promise<{ ProjectStateUpdatesResult: IProjectState }>
) =>
  tool({
    description:
      "Creates, modifies, or deletes `ProjectState` fields according to provided `ProjectStateUpdates`. The `ProjectStateUpdates` includes only changed fields.",
    parameters: z.object({
      ProjectStateUpdates: z
        .object({
          descriptions: z
            .array(
              z
                .object({
                  id: z.string().describe("Description id."),
                  description: z.string().describe("Description text."),
                })
                .describe("Description object.")
            )
            .describe("Array of description objects.")
            .optional(),
          requirements: z
            .array(
              z
                .object({
                  id: z.string().describe("Requirement id."),
                  requirement: z.string().describe("Requirement text."),
                })
                .describe("Requirement object.")
            )
            .describe("Array of requirement object.")
            .optional(),
          tasks: z
            .array(
              z
                .object({
                  id: z.string().describe("Task id."),
                  task: z.string().describe("Task text."),
                  status: z
                    .enum([
                      "todo",
                      "in_progress",
                      "completed",
                      "hold",
                      "no_need",
                    ])
                    .describe("Task status."),
                  suggested_as_next_task: z
                    .boolean()
                    .optional()
                    .describe("If task suggested as next task."),
                })
                .describe("Task object.")
            )
            .describe("Array of task objects.")
            .optional(),
          files: z
            .array(
              z
                .object({
                  path: z.string().describe("Relative file path."),
                  content: z
                    .string()
                    .nullable()
                    .describe("File content. null means delete file"),
                })
                .describe("File object.")
            )
            .describe("Array of file objects.")
            .optional(),
        })
        .describe("Object containing changed ProjectState fields."),
    }),
    // execute: async ({ ProjectStateUpdates }) =>
    //   await updateProjectState({
    //     ProjectStateUpdates: {
    //       ...ProjectStateUpdates,
    //       files: ProjectStateUpdates.files?.map((file) => ({
    //         ...file,
    //         content: file.content === null ? undefined : file.content,
    //       })),
    //     },
    //   }),
    execute: updateProjectState,
  });
