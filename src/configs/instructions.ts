import instructionsContent from "./InstructionsForAIModels.md";

export const INSTRUCTIONS: string = instructionsContent;

export const MESSAGE_TO_USER_PROJECT_DESCRIPTION_REQUEST =
  "Please provide a project description.";
export const MESSAGE_TO_USER_PROJECT_REQUIREMENTS_REQUEST =
  "Please provide a list of requirements for the project. Each requirement should be on a new line.";
export const MESSAGE_GENERATE_PROJECT_FILES_AND_TASKS_REQUEST =
  "Would you like AI model to generate or update tasks and file structure based on the project description and requirements.";
export const MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_TASKS_REQUEST =
  "Generate or update tasks based on the project description, requirements and files.";
export const MESSAGE_TO_AI_MODEL_GENERATE_PROJECT_FILES_REQUEST =
  "Generate or update planned file structure based on the project description, requirements and files. Don't add files content.";
