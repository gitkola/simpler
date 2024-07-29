export interface ISelectProps {
  name: string
  value: string | undefined;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ name, value, options, onChange }: ISelectProps) => {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e)}
      className="appearance-none h-8 bg-white border border-gray-200 py-1 px-2 rounded-md leading-tight hover:shadow-md hover:border-gray-300 focus:outline-none focus:bg-white"
    >
      {options.map((item) => (<option key={item} value={item}>{item}</option>))}
    </select>
  );
}