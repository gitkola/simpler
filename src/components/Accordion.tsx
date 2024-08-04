import React, { useState } from 'react';
import { ChevronRight } from './Icons';

export interface AccordionTextareaProps {
  title: string;
  content: React.JSX.Element;
  className?: string;
  buttonClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const Accordion = ({ title, content, className, buttonClassName, titleClassName, contentClassName }: AccordionTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-sm shadow-md hover:shadow-md ${className}`}>
      <button
        className={`pl-2 pr-1 py-1 flex w-full justify-between items-center rounded-sm border-b border-transparent hover:shadow-md hover:border-b hover:border-opacity-30 hover:border-blue-500 ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-bold ${titleClassName}`}>{title}</span>
        <ChevronRight size={24} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`px-0.5 overflow-y-scroll transition-all duration-300 ease-in-out ${isOpen ? 'max-h-max' : 'max-h-0'} ${contentClassName}`}>
        {content}
      </div>
    </div>
  );
};

export default Accordion;
