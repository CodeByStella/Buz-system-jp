"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for the advanced table
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface ColorSettings {
  headerBg?: string;
  headerText?: string;
  rowBg?: string;
  rowHover?: string;
  border?: string;
  striped?: boolean;
  stripedColor?: string;
}

export interface AdvancedTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  loading?: boolean;
  dense?: boolean;
  scrollable?: boolean;
  maxHeight?: string | number;
  bordered?: boolean;
  stickyHeader?: boolean;
  stickyColumns?: number;
  colorSettings?: ColorSettings;
  searchable?: boolean;
  searchPlaceholder?: string;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  footerContent?: React.ReactNode;
  onRowClick?: (record: T, index: number) => void;
  onCellChange?: (value: any, record: T, column: Column<T>) => void;
  onSave?: (data: T[]) => void;
  onExport?: (data: T[]) => void;
  className?: string;
  tableClassName?: string;
  cellClassName?: string;
  rowKey?: string | ((record: T) => string);
  emptyText?: string;
  loadingText?: string;
  hideHeader?: boolean;
}

export function AdvancedTable<T = any>({
  data,
  columns,
  title,
  description,
  loading = false,
  dense = false,
  scrollable = true,
  maxHeight = "400px",
  bordered = false,
  stickyHeader = true,
  stickyColumns = 0,
  colorSettings = {},
  searchable = false,
  searchPlaceholder = "検索...",
  sortable = true,
  filterable = false,
  pagination = false,
  pageSize = 10,
  footerContent,
  onRowClick,
  className,
  tableClassName,
  cellClassName,
  rowKey = "id",
  emptyText = "データがありません",
  loadingText = "読み込み中...",
  hideHeader = false,
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record as any)[rowKey] || index.toString();
  };

  // Debug sticky header
  console.log("Sticky header enabled:", stickyHeader);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm && searchable) {
      filtered = filtered.filter((record) =>
        columns.some((column) => {
          const value = column.dataIndex
            ? (record as any)[column.dataIndex]
            : (record as any)[column.key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter((record) => {
            const recordValue = (record as any)[key];
            return String(recordValue)
              .toLowerCase()
              .includes(value.toLowerCase());
          });
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters, searchable, filterable, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!sortable || !column.sortable) return;

    setSortConfig((prev) => {
      if (prev?.key === column.key) {
        return {
          key: column.key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  // Handle filter change
  const handleFilterChange = (column: Column<T>, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column.key]: value,
    }));
  };

  // Render cell content
  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = column.dataIndex
      ? (record as any)[column.dataIndex]
      : (record as any)[column.key];

    if (column.render) {
      return column.render(value, record, index);
    }

    return value;
  };

  // Default color settings
  const defaultColors: ColorSettings = {
    headerBg: "bg-slate-50",
    headerText: "text-slate-700",
    rowBg: "bg-white",
    rowHover: "hover:bg-slate-50",
    border: "border-slate-200",
    striped: false,
    stripedColor: "bg-slate-25",
  };

  const colors = { ...defaultColors, ...colorSettings };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader className={dense ? "py-3" : undefined}>
            <CardTitle className={dense ? "text-sm" : undefined}>
              {title}
            </CardTitle>
            <CardDescription className={dense ? "text-xs" : undefined}>
              {loadingText}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={dense ? "py-3" : undefined}>
          <div className={dense ? "space-y-2" : "space-y-4"}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={
                  dense
                    ? "h-6 bg-gray-200 animate-pulse rounded"
                    : "h-12 bg-gray-200 animate-pulse rounded"
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full min-h-0 flex flex-col cardcardcard", className)}>
      {(title || description) && (
        <CardHeader className={dense ? "py-2" : undefined}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className={dense ? "text-sm" : undefined}>
                {title}
              </CardTitle>
              <CardDescription className={dense ? "text-xs" : undefined}>
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent
        className={
          dense
            ? "p-0 flex-1 min-h-0 overflow-hidden"
            : "flex-1 min-h-0 overflow-hidden"
        }
      >
        {/* Search and Filters */}
        {(searchable || filterable) && (
          <div className={dense ? "mb-2 space-y-2" : "mb-4 space-y-3"}>
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={dense ? "pl-9 h-7 text-xs" : "pl-9"}
                />
              </div>
            )}
            {filterable && (
              <div className="flex flex-wrap gap-2">
                {columns
                  .filter((col) => col.filterable)
                  .map((column) => (
                    <div
                      key={column.key}
                      className="flex items-center space-x-2"
                    >
                      <span className={dense ? "text-xs" : "text-sm"}>
                        {column.title}:
                      </span>
                      <Input
                        placeholder={`${column.title}でフィルター`}
                        value={filters[column.key] || ""}
                        onChange={(e) =>
                          handleFilterChange(column, e.target.value)
                        }
                        className={dense ? "h-6 w-24 text-xs" : "h-8 w-32"}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
          
        )}
        {/* Table */}
        <div
          className={cn(
            "h-full min-h-0",
            scrollable ? "overflow-auto scroll-pb-24 border border-gray-200 rounded-md" : "overflow-hidden"
          )}
          style={scrollable ? { 
            maxHeight,
            position: 'relative'
          } : undefined}
        >
          <Table className={cn(
            "pb-4",
            bordered && "border border-gray-200",
            tableClassName
          )}>
            {!hideHeader && (
              <TableHeader 
                className={cn(
                  "bg-white",
                  stickyHeader && "shadow-sm [&_tr]:border-b-0"
                )}
                style={stickyHeader ? { 
                  position: 'sticky', 
                  top: 0, 
                  zIndex: 10,
                  backgroundColor: 'white'
                } : undefined}
              >
                <TableRow
                  className={cn(
                    dense ? "h-8" : undefined, 
                    colors.headerBg
                  )}
                >
                  {columns.map((column, columnIndex) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        dense ? "text-xs py-1" : undefined,
                        column.headerClassName,
                        colors.headerText,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        bordered && "border border-gray-200",
                        stickyColumns > 0 && columnIndex < stickyColumns && "sticky bg-white z-20",
                        sortable &&
                          column.sortable &&
                          "cursor-pointer hover:bg-slate-100"
                      )}
                      style={{ 
                        width: column.width,
                        left: stickyColumns > 0 && columnIndex < stickyColumns 
                          ? `${columnIndex * (typeof column.width === 'number' ? column.width : 150)}px`
                          : undefined
                      }}
                      onClick={() => handleSort(column)}
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-1",
                          column.align === "center" && "justify-center",
                          column.align === "right" && "justify-end"
                        )}
                      >
                        <span>{column.title}</span>
                        {sortable && column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={cn(
                                "h-3 w-3",
                                sortConfig?.key === column.key &&
                                  sortConfig.direction === "asc"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 -mt-1",
                                sortConfig?.key === column.key &&
                                  sortConfig.direction === "desc"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={cn(
                      "text-center py-8 text-gray-500",
                      bordered && "border border-gray-200",
                      cellClassName
                    )}
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => (
                  <TableRow
                    key={getRowKey(record, index)}
                    className={cn(
                      dense ? "h-8" : undefined,
                      colors.rowBg,
                      colors.rowHover,
                      colors.striped && index % 2 === 1 && colors.stripedColor,
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {columns.map((column, columnIndex) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          dense ? "py-1" : undefined,
                          column.cellClassName,
                          cellClassName,
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          bordered && "border border-gray-200",
                          stickyColumns > 0 && columnIndex < stickyColumns && "sticky bg-white z-10"
                        )}
                        style={{ 
                          width: column.width,
                          left: stickyColumns > 0 && columnIndex < stickyColumns 
                            ? `${columnIndex * (typeof column.width === 'number' ? column.width : 150)}px`
                            : undefined
                        }}
                      >
                        {renderCell(column, record, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && sortedData.length > pageSize && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div
              className={
                dense ? "text-xs text-gray-500" : "text-sm text-gray-500"
              }
            >
              {currentPage} / {Math.ceil(sortedData.length / pageSize)} ページ (
              {sortedData.length} 件中{" "}
              {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}-
              {Math.min(currentPage * pageSize, sortedData.length)} 件を表示)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size={dense ? "sm" : "default"}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              <Button
                variant="outline"
                size={dense ? "sm" : "default"}
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(sortedData.length / pageSize),
                      currentPage + 1
                    )
                  )
                }
                disabled={
                  currentPage >= Math.ceil(sortedData.length / pageSize)
                }
              >
                次へ
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {footerContent && (
          <div className="border-t">{footerContent}</div>
        )}
      </CardContent>
    </Card>
  );
}
