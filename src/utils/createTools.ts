export const createTools = (service: "openai" | "anthropic") => {
  const schemaKey = {
    openai: "parameters",
    anthropic: "input_schema",
  };
  const readFilesDefinition = {
    name: "readFiles",
    description:
      "Returns content of files for provided paths. If a path is a directory, all files within it are returned. The function accepts a JSON array of relative file paths. The user executes this function by clicking a button, which returns an array of found files with their content and paths.",
    [schemaKey[service]]: {
      type: "object",
      properties: {
        paths: {
          type: "array",
          items: {
            type: "string",
            description: "Relative file path",
          },
        },
      },
      required: ["paths"],
    },
  };

  const updateFilesDefinition = {
    name: "updateFiles",
    description:
      "Creates, modifies, or deletes project files based on provided file objects. If `content` is provided, the file at `path` will be created or modified. If `content` is not provided, the file at `path` will be deleted. The user executes this function by clicking a button, reviewing changes, and applying them to the project folder.",
    [schemaKey[service]]: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Relative file path",
              },
              content: {
                type: "string",
                description: "Content of the file",
                nullable: true,
              },
            },
            required: ["path"],
          },
        },
      },
      required: ["files"],
    },
  };

  const updateProjectStateDefinition = {
    name: "updateProjectState",
    description:
      "Creates, modifies, or deletes Project State fields according to provided 'project_state_updates'. The 'project_state_updates' includes only changed fields.",
    [schemaKey[service]]: {
      type: "object",
      properties: {
        project_state_updates: {
          type: "object",
          properties: {
            descriptions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                    description: "Description id",
                  },
                  description: {
                    type: "string",
                    description: "Description text",
                  },
                  update: {
                    type: "string",
                    description: "Update operation",
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
                    description: "Requirement id",
                  },
                  requirement: {
                    type: "string",
                    description: "Requirement text",
                  },
                  update: {
                    type: "string",
                    description: "Update operation",
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
                    description: "Task id",
                  },
                  task: {
                    type: "string",
                    description: "Task text",
                  },
                  status: {
                    type: "string",
                    description: "Task status",
                    enum: ["todo", "in_progress", "done", "hold", "no_need"],
                  },
                  suggested_as_next_task: {
                    type: "boolean",
                    description: "If task suggested as next task",
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
                    description: "Relative file path",
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
                required: ["path", "update"],
              },
            },
          },
          required: [],
        },
      },
      required: ["project_state_updates"],
    },
  };

  return [
    readFilesDefinition,
    updateFilesDefinition,
    updateProjectStateDefinition,
  ];
};
