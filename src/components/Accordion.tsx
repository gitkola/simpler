import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from './Icons';

export interface AccordionTextareaProps {
  title: string;
  content: React.JSX.Element;
}

const Accordion = ({ title, content }: AccordionTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm shadow-sm transition-all duration-100 bg-gray-700">
      <button
        className="w-full px-2 py-1 flex justify-between items-center rounded-sm transition-colors hover:shadow-md text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold">{title}</span>
        {!isOpen ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
      </button>
      <div className={`flex-grow ${!isOpen && 'h-0 overflow-hidden'} transition-all duration-100 ease-in-out`}>
        {content}
      </div>
    </div>
  );
};

export default Accordion;
