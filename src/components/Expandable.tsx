import { ChevronDown } from "./Icons";

interface ExpandableComponentProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableComponent: React.FC<ExpandableComponentProps> = ({ title, children }) => {
  return (
    <div className="accordion">
      <div className="accordion-item">
        <input type="checkbox" id="item-1" />
        <label htmlFor="item-1" className="accordion-title">
          <div className="text-xs opacity-50 flex items-center">
            {title}
            <ChevronDown size={24} className="chevron" />
          </div>
        </label>
        <div className="accordion-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const style = `
  .accordion {
    width: 100%;
  }

  .accordion-item {
    margin-bottom: 10px;
    overflow: hidden;
  }

  .accordion-title {
    display: block;
    font-weight: bold;
    cursor: pointer;
  }

  .accordion-content {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease;
  }

  .accordion-content p {
    margin: 0;
    opacity: 0;
  }

  .accordion-item input[type="checkbox"] {
    display: none;
  }

  .accordion-item input[type="checkbox"]:checked ~ .accordion-content {
    max-height: 1000px;
    opacity: 0.5;
    transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease;
  }
    
  .accordion-item input[type="checkbox"]:checked ~ .accordion-title .chevron {
    transform: rotate(180deg);
  }
      
  .chevron {
    transition: transform 0.4s ease;
  }
`;

const StyleTag = () => <style>{style}</style>;

export default function Expandable({ title, children }: ExpandableComponentProps) {
  return (
    <>
      <StyleTag />
      <ExpandableComponent title={title}>
        {children}
      </ExpandableComponent>
    </>
  );
}