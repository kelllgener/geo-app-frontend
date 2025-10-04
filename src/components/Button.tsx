import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

type IconName = 'pencil' | 'trash' | 'plus';

interface ButtonProps {
    name?: IconName;
    label?: string; // optional text next to icon
    onClick?: () => void;
    className?: string;
    toolTip?: string;
    type?: "button" | "submit" | "reset";
}

const icons = {
    pencil: PencilIcon,
    trash: TrashIcon,
    plus: PlusIcon,
};

const Button: React.FC<ButtonProps> = ({ name, label, onClick, className, toolTip, type="button" }) => {
    const Icon = name ? icons[name] : null;

    return (
        <div className="relative inline-block">
            <button type={type} onClick={onClick} className={`peer flex cursor-pointer items-center ${className}`}>
                {Icon && <Icon className="h-4 w-4" />}
                {label && <span>{label}</span>}
            </button>

            {toolTip && <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded border border-gray-300 bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 peer-hover:opacity-100">
                {toolTip}
            </span>}
        </div>
    );
};

export default Button;
