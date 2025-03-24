import React from 'react';
import Table, { TableProps } from './Table';

export interface GroupingConfig<T, G> {
    // The key in the grouped data object
    groupKey: keyof G;
    // The display name for the group header
    groupLabel: keyof G;
    // The items array in each group
    itemsKey: keyof G;
    // Optional: Custom header renderer for the group
    renderGroupHeader?: (group: G) => React.ReactNode;
    // Optional: Action buttons to show in the group header
    groupActions?: (group: G) => React.ReactNode;
    // Optional: Empty state message for each group
    emptyGroupMessage?: React.ReactNode;
}

export interface GroupedTableProps<T, G, K extends string | number = string | number> extends Omit<TableProps<T>, 'data'> {
    // Groups data structure
    groupedData: Record<K, G>;
    // Configuration for how to extract and display groups
    groupingConfig: GroupingConfig<T, G>;
    // Group header class name
    groupHeaderClassName?: string;
    // Group card class name
    groupCardClassName?: string;
}

function GroupedTable<T extends Record<string, any>, G extends Record<string, any>, K extends string | number = string | number>({
    groupedData,
    groupingConfig,
    columns,
    keyField,
    groupHeaderClassName = 'card-header',
    groupCardClassName = 'card mb-4',
    ...restProps
}: GroupedTableProps<T, G, K>) {
    // Check if we have any groups
    if (Object.keys(groupedData).length === 0) {
        return (
        <div className="alert alert-info" role="alert">
            No groups available
        </div>
        );
    }

    return (
    <div className="grouped-tables">
        {Object.entries(groupedData).map(([groupId, groupValue]) => {
            // Type assertion to let TypeScript know groupValue is of type G
            const group = groupValue as G;
            
            // Extract the items array from the group using the itemsKey
            const items = group[groupingConfig.itemsKey] as unknown as T[];
            
            return (
            <div key={groupId} className={groupCardClassName}>
                <div className={groupHeaderClassName}>
                <div className="d-flex justify-content-between align-items-center">
                    {groupingConfig.renderGroupHeader ? (
                    groupingConfig.renderGroupHeader(group)
                    ) : (
                    <h3 className="mb-0">{String(group[groupingConfig.groupLabel])}</h3>
                    )}
                    {groupingConfig.groupActions && groupingConfig.groupActions(group)}
                </div>
                </div>
                <div className="card-body">
                <Table<T>
                    data={items}
                    columns={columns}
                    keyField={keyField}
                    emptyMessage={groupingConfig.emptyGroupMessage || 'No items in this group'}
                    {...restProps}
                />
                </div>
            </div>
            );
        })}
        </div>
    );
}

export default GroupedTable;