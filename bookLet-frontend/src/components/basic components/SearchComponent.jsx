import React from "react";
import { Search } from "lucide-react";

const SearchComponent = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSubmit?.();
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md">
      <Search className="text-gray-400 mr-2" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent text-sm"
      />
    </div>
  );
};

export default SearchComponent;
