import {
  IProjectDescription,
  IProjectState,
  IProjectRequirement,
  IProjectTask,
  IProjectFile,
} from "../types";
import { defineGetProjectStateFiles } from "./defineGetProjectStateFiles";
import { defineUpdateProjectState } from "./defineUpdateProjectState";
import { defineGetProjectStateDescriptions } from "./defineGetProjectStateDescriptions";
import { defineGetProjectStateRequirements } from "./defineGetProjectStateRequirements";
import { defineGetProjectStateTasks } from "./defineGetProjectStateTasks";
import { defineGetProjectStateAnswers } from "./defineGetProjectStateAnswers";

export interface IDefineToolsParams {
  updateProjectState: ({
    updates,
  }: {
    updates: IProjectState;
  }) => Promise<{ ProjectStateUpdatesResult: IProjectState }>;
  getProjectStateFiles: ({
    paths,
  }: {
    paths: string[];
  }) => Promise<{ files: IProjectFile[] }>;
  getProjectStateDescriptions: () => Promise<{
    descriptions: IProjectDescription[];
  }>;
  getProjectStateRequirements: () => Promise<{
    requirements: IProjectRequirement[];
  }>;
  getProjectStateTasks: () => Promise<{
    tasks: IProjectTask[];
  }>;
}

export const defineTools = ({
  updateProjectState,
  getProjectStateFiles,
  getProjectStateDescriptions,
  getProjectStateRequirements,
  getProjectStateTasks,
}: IDefineToolsParams) => ({
  updateProjectState: defineUpdateProjectState(updateProjectState),
  getProjectStateFiles: defineGetProjectStateFiles(getProjectStateFiles),
  getProjectStateDescriptions: defineGetProjectStateDescriptions(
    getProjectStateDescriptions
  ),
  getProjectStateRequirements: defineGetProjectStateRequirements(
    getProjectStateRequirements
  ),
  getProjectStateTasks: defineGetProjectStateTasks(getProjectStateTasks),
  getProjectStateAnswers: defineGetProjectStateAnswers(),
});

export const createTools = (service: "openai" | "anthropic") => {
  const schemaKey = {
    openai: "parameters",
    anthropic: "input_schema",
  };

  const updateProjectStateDefinition = (service: "openai" | "anthropic") => {
    const definition = {
      name: "updateProjectState",
      description:
        "Creates, modifies, or deletes ProjectState fields according to provided 'updates'. The 'updates' includes only changed fields.",
      [schemaKey[service]]: {
        type: "object",
        properties: {
          updates: {
            type: "object",
            properties: {
              descriptions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "Description id.",
                    },
                    description: {
                      type: "string",
                      description: "Description text.",
                    },
                  },
                  required: ["id", "description"],
                },
              },
              requirements: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "Requirement id.",
                    },
                    requirement: {
                      type: "string",
                      description: "Requirement text.",
                    },
                  },
                  required: ["id", "requirement"],
                },
              },
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "Task id.",
                    },
                    task: {
                      type: "string",
                      description: "Task text.",
                    },
                    status: {
                      type: "string",
                      description: "Task status.",
                      enum: [
                        "todo",
                        "in_progress",
                        "completed",
                        "hold",
                        "no_need",
                      ],
                    },
                    suggested_as_next_task: {
                      type: "boolean",
                      description: "If task suggested as next task.",
                    },
                  },
                  required: ["id", "task", "status"],
                },
              },
              files: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    path: {
                      type: "string",
                      description: "Relative file path.",
                    },
                    content: {
                      type: "string",
                      description: "File content",
                      nullable: true,
                    },
                  },
                  required: ["path", "content"],
                },
              },
            },
            required: [],
          },
        },
        required: ["updates"],
      },
    };
    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  const getProjectStateFilesDefinition = (service: "openai" | "anthropic") => {
    const definition = {
      name: "getProjectStateFiles",
      description:
        "Retrieves the contents of multiple project files given their relative paths. Returns an array of objects containing file paths and their contents.",
      [schemaKey[service]]: {
        type: "object",
        properties: {
          paths: {
            type: "array",
            items: {
              type: "string",
              description: "Relative path to a project file.",
            },
            description: "Array of relative file paths within the project.",
            minItems: 1,
          },
        },
        required: ["paths"],
      },
    };

    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  const getProjectStateDescriptionDefinition = (
    service: "openai" | "anthropic"
  ) => {
    const definition = {
      name: "getProjectStateDescriptions",
      description:
        "Gets the project descriptions without requiring any input. Returns an array of description objects.",
      [schemaKey[service]]: {
        type: "object",
        properties: {},
        required: [],
      },
    };

    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  const getProjectStateRequirementsDefinition = (
    service: "openai" | "anthropic"
  ) => {
    const definition = {
      name: "getProjectStateRequirements",
      description:
        "Retrieves the project requirements without requiring any input. Returns an array of requirement objects.",
      [schemaKey[service]]: {
        type: "object",
        properties: {},
        required: [],
      },
    };

    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  const getProjectStateTasksDefinition = (service: "openai" | "anthropic") => {
    const definition = {
      name: "getProjectStateTasks",
      description:
        "Retrieves the project tasks without requiring any input. Returns the project tasks as an array of objects, each containing a task description and its current status.",
      [schemaKey[service]]: {
        type: "object",
        properties: {},
        required: [],
      },
    };

    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  const getProjectStateAnswersDefinition = (
    service: "openai" | "anthropic"
  ) => {
    const definition = {
      name: "getProjectStateAnswers",
      description:
        "Gets the array of questions about the task or project. Returns an array of answers.",
      [schemaKey[service]]: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "string",
              description: "Question about the task or project.",
            },
          },
        },
        required: ["questions"],
      },
    };

    if (service === "openai") {
      return {
        type: "function",
        function: definition,
      };
    }
    return definition;
  };

  return [
    getProjectStateFilesDefinition(service),
    getProjectStateDescriptionDefinition(service),
    getProjectStateRequirementsDefinition(service),
    getProjectStateTasksDefinition(service),
    getProjectStateAnswersDefinition(service),
    updateProjectStateDefinition(service),
  ];
};
