import React from 'react';

export interface TableColumn<T> {
    header: React.ReactNode;
    accessor: keyof T | ((data: T) => React.ReactNode);
    id?: string;
    className?: string;
}

    export interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    keyField: keyof T;
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    rowClassName?: string | ((data: T) => string);
    emptyMessage?: React.ReactNode;
    isLoading?: boolean;
    loadingComponent?: React.ReactNode;
    error?: string | null;
    errorComponent?: React.ReactNode;
    onRowClick?: (data: T) => void;
}

function Table<T extends Record<string, any>>({
    data = [],
    columns = [],
    keyField,
    className = '',
    tableClassName = 'table table-striped table-hover',
    headerClassName = 'table-light',
    bodyClassName = '',
    rowClassName = '',
    emptyMessage = 'No data available',
    isLoading = false,
    loadingComponent,
    error = null,
    errorComponent,
    onRowClick,
}: TableProps<T>) {
    // Get the cell value based on the accessor
    const getCellValue = (row: T, accessor: TableColumn<T>['accessor']) => {
        if (typeof accessor === 'function') {
        return accessor(row);
        }
        return row[accessor];
    };

    // Get row class name based on rowClassName prop
    const getRowClassName = (row: T) => {
        if (typeof rowClassName === 'function') {
        return rowClassName(row);
        }
        return rowClassName;
    };

    // Render loading state
    if (isLoading) {
        return loadingComponent || (
        <div className="text-center py-4">
            <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        );
    }

    // Render error state
    if (error) {
        return errorComponent || (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
        );
    }

    // Render empty state
    if (data.length === 0) {
        return (
        <div className="alert alert-info" role="alert">
            {emptyMessage}
        </div>
        );
    }

    return (
        <div className={`table-responsive ${className}`}>
        <table className={tableClassName}>
            <thead className={headerClassName}>
            <tr>
                {columns.map((column, index) => (
                <th key={column.id || `column-${index}`} className={column.className}>
                    {column.header}
                </th>
                ))}
            </tr>
            </thead>
            <tbody className={bodyClassName}>
            {data.map((row) => (
                <tr 
                key={`row-${String(row[keyField])}`} 
                className={getRowClassName(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                {columns.map((column, index) => (
                    <td key={column.id || `cell-${index}`} className={column.className}>
                    {getCellValue(row, column.accessor)}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default Table;