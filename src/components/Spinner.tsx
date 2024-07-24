export interface ISpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'white';
}

const Spinner = ({ size = 'md', color = 'blue' }: ISpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-24 h-24 border-8',
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-500',
    green: 'border-green-200 border-t-green-500',
    red: 'border-red-200 border-t-red-500',
    yellow: 'border-yellow-200 border-t-yellow-500',
    white: 'border-gray-300 border-t-white',
  };

  return (
    <div className={`
      ${sizeClasses[size] || sizeClasses.md}
      ${colorClasses[color] || colorClasses.blue}
      rounded-full animate-spin
    `}></div>
  );
};

export default Spinner;