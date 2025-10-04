import { type ChangeEvent } from "react";
import Button from "./Button";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch: () => void;
  onClear: () => void;
}

const SearchInput = ({
  value,
  onChange,
  placeholder,
  onSearch,
  onClear
}: SearchInputProps) => {
  return (
    <div>
      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="text"
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {value && (
          <Button
            label="✕"
            className="text-gray-400"
            onClick={onClear}
            toolTip="clear"
          />
        )}
      </label>
      <button className="btn btn-neutral join-item" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchInput;
