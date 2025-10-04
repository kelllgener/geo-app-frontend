import type { ChangeEvent } from 'react';

interface InputProps {
    id?: string;
    label?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
    error?: string;
}

const Input = ({ id, label, value, onChange, placeholder, type, className, error }: InputProps) => {
    return (
        <div className="flex flex-col">
            <label className='text-sm mt-2' htmlFor={id}>{label}</label>
            <div
                className={`flex items-center bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-800 ${className}`}
            >
                <input
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
            </div>
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>} 
        </div>
    );
};

export default Input;
