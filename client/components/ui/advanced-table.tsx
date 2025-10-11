"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/customInput";
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
import { Search, ChevronUp, ChevronDown } from "lucide-react";
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
  colspan?: number;
  rowspan?: number;
}

// Cell span configuration for complex tables
export interface CellSpan<T = any> {
  rowIndex: number;
  colIndex: number;
  colspan?: number;
  rowspan?: number;
  isSpanned?: boolean; // For cells that are covered by rowspan/colspan
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
  title?: string | React.ReactNode;
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
  cellSpans?: CellSpan<T>[]; // For complex table layouts with colspan/rowspan
  getCellSpan?: (record: T, index: number, column: Column<T>) => CellSpan<T> | null;
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
  cellSpans = [],
  getCellSpan,
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

  // Helper function to check if a cell should be skipped due to rowspan/colspan
  const shouldSkipCell = (rowIndex: number, colIndex: number): boolean => {
    if (getCellSpan) {
      const record = paginatedData[rowIndex];
      const column = columns[colIndex];
      const cellSpan = getCellSpan(record, rowIndex, column);
      return cellSpan?.isSpanned || false;
    }
    
    // Check cellSpans array
    const span = cellSpans.find(s => s.rowIndex === rowIndex && s.colIndex === colIndex);
    return span?.isSpanned || false;
  };

  // Helper function to get cell span attributes
  const getCellSpanAttrs = (rowIndex: number, colIndex: number) => {
    if (getCellSpan) {
      const record = paginatedData[rowIndex];
      const column = columns[colIndex];
      const cellSpan = getCellSpan(record, rowIndex, column);
      return {
        rowSpan: cellSpan?.rowspan || 1,
        colSpan: cellSpan?.colspan || 1,
      };
    }
    
    // Check cellSpans array
    const span = cellSpans.find(s => s.rowIndex === rowIndex && s.colIndex === colIndex);
    return {
      rowSpan: span?.rowspan || 1,
      colSpan: span?.colspan || 1,
    };
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
      <Card className={cn("p-2 sm:p-4", className)}>
        {(title || description) && (
          <CardHeader className={dense ? "p-0" : "py-0 px-2 sm:px-4"}>
            <CardTitle className={cn(
              dense ? "text-sm" : "text-base sm:text-lg"
            )}>
              {title}
            </CardTitle>
            <CardDescription className={cn(
              dense ? "text-xs" : "text-xs sm:text-sm"
            )}>
              {loadingText}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={dense ? "py-2 sm:py-3 px-0" : "p-2 sm:p-4"}>
          <div className={dense ? "space-y-2" : "space-y-3 sm:space-y-4"}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={
                  dense
                    ? "h-6 sm:h-8 bg-gray-200 animate-pulse rounded"
                    : "h-8 sm:h-12 bg-gray-200 animate-pulse rounded"
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("h-full min-h-0 flex flex-col cardcardcard", className)}
    >
      {(title || description) && (
        <CardHeader className={cn(
          dense ? "p-0" : "py-0 px-2 sm:px-4"
        )}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 relative">
            <div className={cn(
              dense ? "text-sm sm:text-base" : "text-base sm:text-lg"
            )}>
              {title}
            </div>
            <CardDescription className={cn(
              dense ? "text-xs" : "text-xs sm:text-sm"
            )}>
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      )}

      <CardContent
        className={cn(
          "flex-1 min-h-0 ",
          dense ? "p-0" : "p-2 sm:p-4 lg:p-6"
        )}
      >
        {/* Search and Filters */}
        {(searchable || filterable) && (
          <div className={cn(
            "space-y-2 sm:space-y-3",
            dense ? "mb-2" : "mb-3 sm:mb-4"
          )}>
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <CustomInput
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-8 sm:pl-9",
                    dense ? "h-6 sm:h-7 text-xs" : "h-8 sm:h-9 text-sm"
                  )}
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
                      className="flex items-center space-x-1 sm:space-x-2"
                    >
                      <span className={cn(
                        "whitespace-nowrap",
                        dense ? "text-xs" : "text-xs sm:text-sm"
                      )}>
                        {column.title}:
                      </span>
                      <CustomInput
                        placeholder={`${column.title}でフィルター`}
                        value={filters[column.key] || ""}
                        onChange={(e) =>
                          handleFilterChange(column, e.target.value)
                        }
                        className={cn(
                          dense 
                            ? "h-6 w-20 sm:w-24 text-xs" 
                            : "h-7 sm:h-8 w-24 sm:w-32 text-xs sm:text-sm"
                        )}
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
            "min-h-0",
            scrollable
              ? "overflow-x-auto overflow-y-auto scroll-pb-24 border border-gray-200 rounded-sm sm:rounded-md"
              : "",
            "touch-pan-x touch-pan-y" // Better touch scrolling on mobile
          )}
          style={
            scrollable
              ? {
                  position: "relative",
                  WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                }
              : undefined
          }
        >
          <Table
            className={cn(
              "pb-4 w-full min-w-full",
              bordered && "border border-gray-200",
              tableClassName
            )}
          >
            {!hideHeader && (
              <TableHeader
                className={cn(
                  "bg-white",
                  stickyHeader && "shadow-sm [&_tr]:border-b-0"
                )}
                style={
                  stickyHeader
                    ? {
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        backgroundColor: "white",
                      }
                    : undefined
                }
              >
                <TableRow
                  className={cn(
                    dense ? "h-6 sm:h-8" : "h-8 sm:h-10", 
                    colors.headerBg
                  )}
                >
                  {columns.map((column, columnIndex) => (
                    <TableHead
                      key={column.key}
                      rowSpan={column.rowspan}
                      colSpan={column.colspan}
                      className={cn(
                        dense ? "text-[10px] sm:text-xs py-0.5 sm:py-1 px-1 sm:px-2" : "text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3",
                        column.headerClassName,
                        colors.headerText,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        bordered && "border border-gray-200",
                        stickyColumns > 0 &&
                          columnIndex < stickyColumns &&
                          "sticky bg-white z-20",
                        sortable &&
                          column.sortable &&
                          "cursor-pointer hover:bg-slate-100"
                      )}
                      style={{
                        width: column.width,
                        minWidth: typeof column.width === "number" 
                          ? `${column.width * 0.7}px` 
                          : column.width,
                        left:
                          stickyColumns > 0 && columnIndex < stickyColumns
                            ? `${
                                columnIndex *
                                (typeof column.width === "number"
                                  ? column.width
                                  : 150)
                              }px`
                            : undefined,
                      }}
                      onClick={() => handleSort(column)}
                    >
                      <div
                        className={cn(
                          "flex items-center space-x-0.5 sm:space-x-1",
                          column.align === "center" && "justify-center",
                          column.align === "right" && "justify-end"
                        )}
                      >
                        <span className="truncate">{column.title}</span>
                        {sortable && column.sortable && (
                          <div className="flex flex-col flex-shrink-0">
                            <ChevronUp
                              className={cn(
                                "h-2 w-2 sm:h-3 sm:w-3",
                                sortConfig?.key === column.key &&
                                  sortConfig.direction === "asc"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "h-2 w-2 sm:h-3 sm:w-3 -mt-0.5 sm:-mt-1",
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
                      "text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500",
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
                      dense ? "h-6 sm:h-8" : "h-8 sm:h-10",
                      colors.rowBg,
                      colors.rowHover,
                      colors.striped && index % 2 === 1 && colors.stripedColor,
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {columns.map((column, columnIndex) => {
                      // Skip cell if it's covered by rowspan/colspan
                      if (shouldSkipCell(index, columnIndex)) {
                        return null;
                      }

                      const spanAttrs = getCellSpanAttrs(index, columnIndex);
                      
                      return (
                        <TableCell
                          key={column.key}
                          rowSpan={spanAttrs.rowSpan}
                          colSpan={spanAttrs.colSpan}
                          className={cn(
                            dense ? "py-0.5 sm:py-1 px-1 sm:px-2 text-[10px] sm:text-xs" : "py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm",
                            column.cellClassName,
                            cellClassName,
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            bordered && "border border-gray-200",
                            stickyColumns > 0 &&
                              columnIndex < stickyColumns &&
                              "sticky bg-white z-10"
                          )}
                          style={{
                            width: column.width,
                            minWidth: typeof column.width === "number" 
                              ? `${column.width * 0.7}px` 
                              : column.width,
                            left:
                              stickyColumns > 0 && columnIndex < stickyColumns
                                ? `${
                                    columnIndex *
                                    (typeof column.width === "number"
                                      ? column.width
                                      : 150)
                                  }px`
                                : undefined,
                          }}
                        >
                          {renderCell(column, record, index)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && sortedData.length > pageSize && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <div
              className={cn(
                "text-gray-500",
                dense ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
              )}
            >
              <span className="hidden sm:inline">
                {currentPage} / {Math.ceil(sortedData.length / pageSize)} ページ (
                {sortedData.length} 件中{" "}
                {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}-
                {Math.min(currentPage * pageSize, sortedData.length)} 件を表示)
              </span>
              <span className="sm:hidden">
                {currentPage}/{Math.ceil(sortedData.length / pageSize)} ({sortedData.length}件)
              </span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size={dense ? "sm" : "default"}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
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
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                次へ
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {footerContent && <div className="border-t mt-2 sm:mt-3">{footerContent}</div>}
      </CardContent>
    </Card>
  );
}
