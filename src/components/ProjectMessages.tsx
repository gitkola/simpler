import { useAppSelector } from '../store';
import Editor from './Editor';

export const ProjectMessages = () => {
  const currentProjectMessages = useAppSelector((state) => state.currentProject.currentProjectMessages);
  const theme = useAppSelector((state) => state.settings.theme);
  if (!currentProjectMessages) return null;
  return (<Editor
    value={JSON.stringify(currentProjectMessages, null, 2) || ""}
    language={'json'}
    minHeight={24}
    style={{
      marginLeft: 25,
      lineHeight: 1.6,
    }}
    theme={theme}
    disabled={true}
  />);
};