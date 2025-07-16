import Image from 'next/image'
import React from 'react'

type TableSearchProps = {
  placeholder?: string;
  className?: string;
};

const TableSearch: React.FC<TableSearchProps> = ({
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div
      className={`w-full md:w-auto flex items-center gap-2 text-xs rounded-full p-1 ring-[1.5px] ring-gray-300 px-2 ${className}`}
    >
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
