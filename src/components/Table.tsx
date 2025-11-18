import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

const Table = ({ columns, data, onSort, sortKey, sortDirection }: TableProps) => {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stroke">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key, column.sortable)}
                className={`px-4 py-3 text-left text-sm font-medium text-primary-text ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-primary">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-stroke hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-dark">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

