import React from 'react';
import ReactMarkdown from 'react-markdown';
import './markdown.css';

const Markdown: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

export default Markdown;