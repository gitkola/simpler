import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppSelector } from '../store';


export const ProjectState = () => {
  const currentProjectState = useAppSelector((state) => state.currentProject.currentProjectState);
  if (!currentProjectState) return null;
  return (
    <SyntaxHighlighter className="no-scrollbar rounded-md p-0 m-0" language={'json'} style={vscDarkPlus} wrapLongLines>
      {(currentProjectState && JSON.stringify(currentProjectState, null, 2)) || ''}
    </SyntaxHighlighter>
  );
};