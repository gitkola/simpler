export const createTools = (service: "openai" | "anthropic") => {
  const schemaKey = {
    openai: "parameters",
    anthropic: "input_schema",
  };

  const updateProjectStateDefinition = (service: "openai" | "anthropic") => {
    const definition = {
      name: "updateProjectState",
      description:
        "Creates, modifies, or deletes ProjectState fields according to provided 'ProjectStateUpdates'. The 'ProjectStateUpdates' includes only changed fields.",
      [schemaKey[service]]: {
        type: "object",
        properties: {
          ProjectStateUpdates: {
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
                    update: {
                      type: "string",
                      description: "Update operation.",
                      enum: ["add", "modify", "delete"],
                    },
                  },
                  required: ["id", "description", "update"],
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
                    update: {
                      type: "string",
                      description: "Update operation.",
                      enum: ["add", "modify", "delete"],
                    },
                  },
                  required: ["id", "requirement", "update"],
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
                    update: {
                      type: "string",
                      description: "Update operation",
                      enum: ["add", "modify", "delete"],
                    },
                  },
                  required: ["id", "task", "status", "update"],
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
                    update: {
                      type: "string",
                      description: "Update operation",
                      enum: ["add", "modify", "delete"],
                    },
                  },
                  required: ["path", "content", "update"],
                },
              },
            },
            required: [],
          },
        },
        required: ["ProjectStateUpdates"],
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
      // returns: {
      //   type: "object",
      //   properties: {
      //     files: {
      //       type: "array",
      //       items: {
      //         type: "object",
      //         properties: {
      //           path: {
      //             type: "string",
      //             description: "Relative path of the file.",
      //           },
      //           contents: {
      //             type: "string",
      //             description: "Contents of the file.",
      //           },
      //         },
      //         required: ["path", "contents"],
      //       },
      //       description:
      //         "Array of objects containing file paths and their contents.",
      //     },
      //   },
      // },
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
      // returns: {
      //   type: "object",
      //   properties: {
      //     descriptions: {
      //       type: "array",
      //       items: {
      //         type: "object",
      //         properties: {
      //           id: {
      //             type: "number",
      //             description: "Unique identifier for the description.",
      //           },
      //           description: {
      //             type: "string",
      //             description: "The project description text.",
      //           },
      //         },
      //         required: ["id", "description"],
      //       },
      //       description: "An array of project description objects.",
      //     },
      //   },
      //   required: ["descriptions"],
      // },
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

  return [
    getProjectStateFilesDefinition(service),
    getProjectStateDescriptionDefinition(service),
    getProjectStateRequirementsDefinition(service),
    getProjectStateTasksDefinition(service),
    updateProjectStateDefinition(service),
  ];
};
