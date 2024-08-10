import { useAppDispatch } from "../store";
import { handleSetActiveProject } from "../store/projectsSlice";
import { selectProjectStateFolder } from "../services/projectStateService";

export const useOpenProject = () => {
  const dispatch = useAppDispatch();

  const handleOpenProject = async () => {
    try {
      const projectPath = await selectProjectStateFolder();
      if (projectPath) {
        dispatch(handleSetActiveProject(projectPath));
      }
    } catch (error) {
      console.error("Failed to create/open project:", error);
    }
  };
  return handleOpenProject;
};
