import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import Editor from './Editor';


interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  language: string;
  theme: "light" | "dark";
}

export default function DiffViewer({ oldValue, newValue, language, theme }: DiffViewerProps) {

  const highlightSyntax = (str: string) => (
    <Editor language={language} value={str} onChange={() => { }} onKeyDown={() => { }} disabled={true} style={{}} theme={theme} />
  );

  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      extraLinesSurroundingDiff={0}
      splitView={true}
      compareMethod={DiffMethod.WORDS_WITH_SPACE}
      disableWordDiff={false}
      hideLineNumbers={true}
      showDiffOnly={false}
      useDarkTheme={theme === 'dark'}
      renderContent={highlightSyntax}
      styles={{
        diffContainer: {
          overflowX: 'auto',
          overflowY: 'auto',
          background: 'none',
          padding: 0,
          margin: 0,
          border: 0,
          tableLayout: 'fixed',
        },
        content: {
          padding: 0,
          margin: 0,
          color: 'blue',
          tableLayout: 'inherit',
          border: 0,
        },
        diffRemoved: {
          padding: 0,
          margin: 0,
          border: 0,
          span: {
            padding: 0,
            margin: 0,
            border: 0,
          },
        },
        diffAdded: {
          padding: 0,
          margin: 0,
          border: 0,
          span: {
            padding: 0,
            margin: 0,
            border: 0,
          },
        },
        line: {
          padding: 0,
          margin: 0,
          background: 'none',
          border: 0,
        },
        contentText: {
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          padding: 0,
          margin: 0,
          border: 0,
          background: 'none',
          boxSizing: 'inherit',
          display: 'inherit',
          fontSize: 'inherit',
          fontStyle: 'inherit',
          fontVariantLigatures: 'inherit',
          fontWeight: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
          tabSize: 'inherit',
          textIndent: 'inherit',
          textRendering: 'inherit',
          textTransform: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
          outline: 0,
          userSelect: 'text',
        },
      }}
    />
  );
}