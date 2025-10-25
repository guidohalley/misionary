import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import { Card } from '@/components/ui';

const { Tr, Th, Td, THead, TBody } = Table;

export interface ColumnDefPro<T> {
  header: string;
  accessorKey?: keyof T;
  id?: string;
  cell?: (props: { row: T; index: number }) => React.ReactNode;
  enableSorting?: boolean;
  size?: number;
  mobileCard?: {
    label?: string;
    show?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  };
}

export interface DataTableProProps<T> {
  columns: ColumnDefPro<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  // Paginación
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizes?: number[];
  // Ordenamiento
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  // Mobile
  mobileCardRender?: (row: T, index: number) => React.ReactNode;
  // Estilos
  className?: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

function DataTablePro<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onRowClick,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
  onSort,
  mobileCardRender,
  className = '',
}: DataTableProProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const pageSizeOptions = useMemo(
    () => pageSizes.map((size) => ({ value: size, label: `${size} / página` })),
    [pageSizes]
  );

  const selectedPageSize = pageSizeOptions.find((o) => o.value === pageSize) || pageSizeOptions[0];

  const handleSort = (key: string, enableSorting?: boolean) => {
    if (!enableSorting) return;

    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const renderSortIcon = (columnKey: string, enableSorting?: boolean) => {
    if (!enableSorting) return null;

    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <HiChevronUp className="w-4 h-4 ml-1 inline" />
      ) : (
        <HiChevronDown className="w-4 h-4 ml-1 inline" />
      );
    }

    return <HiSelector className="w-4 h-4 ml-1 inline text-gray-400" />;
  };

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <Table className="w-full">
        <THead>
          <Tr>
            {columns.map((column, index) => {
              const key = column.accessorKey as string || column.id || `col-${index}`;
              return (
                <Th
                  key={key}
                  className={column.enableSorting ? 'cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  onClick={() => handleSort(key, column.enableSorting)}
                  style={{ width: column.size ? `${column.size}px` : 'auto' }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIcon(key, column.enableSorting)}
                  </div>
                </Th>
              );
            })}
          </Tr>
        </THead>
        <TBody>
          {loading ? (
            <Tr>
              <Td colSpan={columns.length}>
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </Td>
            </Tr>
          ) : data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length}>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay datos para mostrar
                </div>
              </Td>
            </Tr>
          ) : (
            data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.02 }}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => {
                  const key = column.accessorKey as string || column.id || `col-${colIndex}`;
                  const value = column.accessorKey ? row[column.accessorKey] : undefined;

                  return (
                    <Td key={key}>
                      {column.cell ? column.cell({ row, index: rowIndex }) : value}
                    </Td>
                  );
                })}
              </motion.tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );

  const renderMobileCards = () => {
    if (mobileCardRender) {
      return (
        <div className="md:hidden space-y-3">
          <AnimatePresence>
            {data.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                {mobileCardRender(row, index)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    }

    // Vista por defecto si no se proporciona render custom
    return (
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {data.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <Card
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onRowClick?.(row)}
              >
                <div className="space-y-2">
                  {columns
                    .filter((col) => col.mobileCard?.show !== false)
                    .map((column, colIndex) => {
                      const key = column.accessorKey as string || column.id || `col-${colIndex}`;
                      const value = column.accessorKey ? row[column.accessorKey] : undefined;

                      return (
                        <div key={key} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {column.mobileCard?.label || column.header}:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {column.mobileCard?.render
                              ? column.mobileCard.render(value, row)
                              : column.cell
                              ? column.cell({ row, index })
                              : value}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Tabla Desktop */}
      {renderDesktopTable()}

      {/* Cards Mobile */}
      {renderMobileCards()}

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <Pagination
          pageSize={pageSize}
          currentPage={currentPage}
          total={totalItems}
          onChange={onPageChange}
        />
        <div style={{ minWidth: 130 }}>
          <Select
            size="sm"
            menuPlacement="top"
            isSearchable={false}
            value={selectedPageSize}
            options={pageSizeOptions}
            onChange={(option: any) => onPageSizeChange(option?.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default DataTablePro;

