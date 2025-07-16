import React from 'react'

export interface TableColumn {
  header: string;
  accessor: string;
  className?: string;
}

type TableProps<T> = {
  columns: TableColumn[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
};

const Table = <T,>({ columns, renderRow, data }: TableProps<T>) => {
  return (
    <table className="mt-4 w-full"> 
      <thead>
        <tr className='text-left text-gray-500 text-sm'>
          {columns.map((col) => (
            <th key={col.accessor} className={`px-4 py-2 text-left ${col.className || ''}`}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
