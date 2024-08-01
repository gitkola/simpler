import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from './Icons';

export interface AccordionTextareaProps {
  title: string;
  content: React.JSX.Element;
}

const Accordion = ({ title, content }: AccordionTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-[600px] rounded-sm shadow-md transition-all duration-100 border border-transparent hover:shadow-md hover:border hover:border-opacity-30 hover:border-blue-500">
      <button
        className="pl-2 pr-1 py-1 flex w-full justify-between items-center rounded-sm transition-colors border-b border-transparent hover:shadow-md hover:border-b hover:border-opacity-30 hover:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold">{title}</span>
        {!isOpen ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
      </button>
      <div className={`flex-grow ${!isOpen && 'h-0 overflow-hidden'} transition-all duration-100 ease-in-out px-0.5`}>
        {content}
      </div>
    </div>
  );
};

export default Accordion;
