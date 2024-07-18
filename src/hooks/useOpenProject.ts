import { useAppDispatch } from "../store";
import { handleSetActiveProject } from "../store/projectsSlice";
import { selectProjectStateFolder } from "../utils/projectStateUtils";
import { useNavigate } from "react-router-dom";

export const useOpenProject = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenProject = async () => {
    try {
      const projectPath = await selectProjectStateFolder();
      if (projectPath) {
        dispatch(handleSetActiveProject(projectPath));
        navigate(`/project`);
      }
    } catch (error) {
      console.error("Failed to create/open project:", error);
    }
  };
  return handleOpenProject;
};
