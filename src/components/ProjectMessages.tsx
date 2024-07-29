import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppSelector } from '../store';


export const ProjectMessages = () => {
  const currentProjectMessages = useAppSelector((state) => state.currentProject.currentProjectMessages);
  if (!currentProjectMessages) return null;
  return (
    <SyntaxHighlighter language={'json'} style={vscDarkPlus} wrapLongLines>
      {(currentProjectMessages && JSON.stringify(currentProjectMessages, null, 2)) || ''}
    </SyntaxHighlighter>
  )
};