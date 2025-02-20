import { cPrimary } from "../styles/styles";
import AppIcon, { AppIcons } from "./Icons";

interface ISquareButtonProps {
  onClick: (data: any) => void;
  icon: AppIcons;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  iconSize?: number;
  iconColor?: string;
  iconClassName?: string;
}

export default function SquareButton({
  onClick,
  icon,
  className,
  disabled,
  isActive,
  iconSize = 32,
  iconColor,
  iconClassName,
}: ISquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center active:opacity-40 transition-all duration-100  ${cPrimary(isActive)} ${className} group`}
      disabled={disabled}
    >
      <AppIcon
        icon={icon}
        size={iconSize}
        color={iconColor}
        className={`group-hover:scale-105 group-active:scale-95 opacity-80 group-hover:opacity-100 transition-all duration-100 ${iconClassName}`}
      />
    </button>
  );
}