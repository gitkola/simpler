import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import Editor from './Editor';


interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  language: string;
}

export default function DiffViewer({ oldValue, newValue, language }: DiffViewerProps) {

  const highlightSyntax = (str: string) => (
    <Editor language={language} value={str} onChange={() => { }} onKeyDown={() => { }} disabled={true} />
  );

  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      extraLinesSurroundingDiff={0}
      splitView={true}
      compareMethod={DiffMethod.WORDS_WITH_SPACE}
      disableWordDiff={true}
      hideLineNumbers={true}
      useDarkTheme={true}
      renderContent={highlightSyntax}
      // styles={{
      //   contentText: {
      //     fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      //     margin: 0,
      //     padding: 0,
      //     border: 0,
      //     background: 'none',
      //     boxSizing: 'inherit',
      //     display: 'inherit',
      //     fontSize: 'inherit',
      //     fontStyle: 'inherit',
      //     fontVariantLigatures: 'inherit',
      //     fontWeight: 'inherit',
      //     letterSpacing: 'inherit',
      //     lineHeight: 'inherit',
      //     tabSize: 'inherit',
      //     textIndent: 'inherit',
      //     textRendering: 'inherit',
      //     textTransform: 'inherit',
      //     whiteSpace: 'pre-wrap',
      //     wordBreak: 'keep-all',
      //     overflowWrap: 'break-word',
      //     outline: 0,
      //     userSelect: 'text',
      //   },
      // }}
      showDiffOnly={false}
    />
  );
}