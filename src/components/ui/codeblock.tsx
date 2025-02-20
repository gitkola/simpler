// Referenced from Vercel's AI Chatbot and modified to fit the needs of this project
// https://github.com/vercel/ai-chatbot/blob/c2757f87f986b7f15fdf75c4c89cb2219745c53f/components/ui/codeblock.tsx

'use client'

import { FC, memo } from 'react'
// import SyntaxHighlighter from 'react-syntax-highlighter'
// import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { Button } from '@/components/ui/button'
import { generateId } from 'ai'
import { Check, Copy, Download } from 'lucide-react'
import { RootState, useAppSelector } from '@/store'
import { CodeCopyBlock } from '../code-copy-block'

interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

const programmingLanguages: languageMap = {
  javascript: '.js',
  jsx: '.jsx',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  tsx: '.tsx',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css'
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  // const theme = useAppSelector((state: RootState) => state.settings.theme)
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const downloadAsFile = () => {
    console.log({ window })
    if (typeof window === 'undefined') {
      return
    }
    const fileExtension = programmingLanguages[language] || '.file'
    const suggestedFileName = `file-${generateId()}${fileExtension}`
    const fileName = window.prompt('Enter file name', suggestedFileName)

    // if (!fileName) {
    //   // User pressed cancel on prompt.
    //   return
    // }

    const blob = new Blob([value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = fileName || suggestedFileName
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log({ downloadAsFile: { fileName, suggestedFileName, url, link } })
  }

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className="relative w-full mt-2 mb-6 border border-neutral-500/50 rounded-md overflow-hidden">
      <div className="flex items-center justify-between w-full px-3 py-0.5 bg-neutral-500/50 text-zinc-100 rounded rounded-b-none">
        <span className="text-xs lowercase">{language}</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="text-xs focus-visible:ring-1 focus-visible:ring-offset-0 hover:bg-gray-200/20 w-8 h-8"
            onClick={downloadAsFile}
            size="icon"
          >
            <Download className="w-4 h-4 text-zinc-100" />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-xs focus-visible:ring-1 focus-visible:ring-offset-0 hover:bg-gray-200/20 w-8 h-8"
            onClick={onCopy}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-100" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>
      {/* <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? coldarkDark : coldarkCold}
        PreTag="div"
        // showLineNumbers
        customStyle={{
          margin: 0,
          // width: '100%',
          // background: 'transparent',
          // padding: '1rem',
          // borderRadius: '0.5rem'
        }}
        // lineNumberStyle={{
        //   userSelect: 'none',
        //   width: '2em',
        //   display: 'inline-block',
        //   marginRight: '0.5rem',
        //   color: 'var(--code-line-number-color)',
        //   borderRight: '1px solid var(--code-line-number-border-color)'
        // }}
        codeTagProps={{
          style: {
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }
        }}
      >
        {value}
      </SyntaxHighlighter> */}
      <CodeCopyBlock value={value} language={language} />
    </div>
  )
})
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
