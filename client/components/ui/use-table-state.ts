import { useState, useMemo } from "react";

export interface TableState {
  searchTerm: string;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  } | null;
  currentPage: number;
  filters: Record<string, string>;
}

export interface UseTableStateOptions {
  initialPageSize?: number;
  initialSearchTerm?: string;
  initialSort?: {
    key: string;
    direction: "asc" | "desc";
  };
  initialFilters?: Record<string, string>;
}

export function useTableState<T = any>(
  data: T[],
  options: UseTableStateOptions = {}
) {
  const {
    initialPageSize = 10,
    initialSearchTerm = "",
    initialSort = null,
    initialFilters = {},
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((record) =>
        Object.values(record as any).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((record) => {
          const recordValue = (record as any)[key];
          return String(recordValue).toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

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
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key,
        direction: "asc",
      };
    });
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    // State
    searchTerm,
    sortConfig,
    currentPage,
    filters,
    pageSize,
    
    // Data
    filteredData,
    sortedData,
    paginatedData,
    
    // Actions
    setSearchTerm,
    setCurrentPage,
    setPageSize,
    handleSort,
    handleFilterChange,
    resetFilters,
    resetPagination,
    
    // Computed
    totalPages: Math.ceil(sortedData.length / pageSize),
    totalItems: sortedData.length,
    hasNextPage: currentPage < Math.ceil(sortedData.length / pageSize),
    hasPreviousPage: currentPage > 1,
  };
}
