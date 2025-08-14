// components/ui/table.tsx
import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-gray-200 bg-white ${className}`} {...props}>
      {children}
    </tbody>
  );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '', ...props }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', ...props }) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};