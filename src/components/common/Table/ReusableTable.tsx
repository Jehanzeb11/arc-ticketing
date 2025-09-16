"use client";
import React, { useMemo, useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Input,
  Select,
  MenuItem,
  Skeleton,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import Button from "@/components/common/Button/Button";
import { visuallyHidden } from "@mui/utils";
import styles from "@/components/common/Table/ReusableTable.module.css";
import TableSelectFilterMain from "../Select/TableSelectFilterMain";

interface Column {
  key: string;
  title: string;
  filterType?: "dropdown" | "text" | "date";
  filterOptions?: { value: string; label: string }[];
  filterable?: boolean;
}

interface Row {
  id: number;
  [key: string]: any;
}

interface Action {
  icon?: string; // Optional static icon path
  icon2?: (row: Row) => string; // Optional function to dynamically return icon path
  onClick: (row: Row) => void;
  className?: string;
  tooltip?: string | ((row: Row) => string); // Optional tooltip text or function to dynamically return tooltip text
}

interface EnhancedTableProps {
  columns: Column[];
  data: Row[];
  actions?: Action[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableFiltering?: boolean;
  enableRowSelection?: boolean;
  pageSize?: number;
  totalRows?: number;
  page?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onFilterApply?: (filters: { [key: string]: string }) => void;
  isLoading?: boolean;
  onRowClick?: (row: Row) => void; // Added prop for row click handling
  maxContentWidth?: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function EnhancedTable({
  columns,
  data,
  actions = [],
  enableSorting = false,
  enablePagination = false,
  enableFiltering = false,
  enableRowSelection = false,
  pageSize: initialPageSize = 10,
  totalRows = data.length,
  page: initialPage = 0,
  onPageChange,
  onRowsPerPageChange,
  onFilterApply,
  isLoading = false,
  maxContentWidth,
  onRowClick,
}: EnhancedTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    if (!enableSorting) return;
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!enableRowSelection) return;
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    if (!enableRowSelection) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPageSize(newRowsPerPage);
    setPage(0);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    if (!enableFiltering || !onFilterApply) return;
    onFilterApply(filters);
  };

  const sortedData = useMemo(() => {
    if (!enableSorting || !orderBy) return data;
    return [...data].sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      const stringA = React.isValidElement(valueA)
        ? valueA.props.children || ""
        : typeof valueA === "object" && valueA !== null
        ? JSON.stringify(valueA)
        : valueA;
      const stringB = React.isValidElement(valueB)
        ? valueB.props.children || ""
        : typeof valueB === "object" && valueB !== null
        ? JSON.stringify(valueB)
        : valueB;
      return getComparator(order, orderBy)(
        { [orderBy]: stringA },
        { [orderBy]: stringB }
      );
    });
  }, [data, order, orderBy, enableSorting]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    return sortedData?.slice(page * pageSize, (page + 1) * pageSize);
  }, [sortedData, page, pageSize, enablePagination]);

  const skeletonRows = Array.from({ length: pageSize }, (_, index) => index);

  return (
    <Box sx={{ width: "100%" }} className={styles.tableContainer}>
      {enableFiltering && (
        <Box className={styles.filterContainer}>
          {columns.map((column) => {
            if (!column.filterable) return null;
            return (
              <Box key={column.key} className={styles.filterWrapper}>
                {column.filterType === "dropdown" && column.filterOptions ? (
                  // <Select
                  //   value={filters[column.key] || ""}
                  //   onChange={(e) =>
                  //     handleFilterChange(column.key, e.target.value as string)
                  //   }
                  //   className={styles.filterInput}
                  //   displayEmpty
                  //   renderValue={(selected) => {
                  //     if (!selected)
                  //       return (
                  //         <span style={{ color: "#b2b2b2" }}>
                  //           {column.title}
                  //         </span>
                  //       );
                  //     return (
                  //       column.filterOptions?.find(
                  //         (opt) => opt.value === selected
                  //       )?.label || selected
                  //     );
                  //   }}
                  // >
                  //   {column.filterOptions.map((option) => (
                  //     <MenuItem key={option.value} value={option.value}>
                  //       {option.label}
                  //     </MenuItem>
                  //   ))}
                  // </Select>
                  <TableSelectFilterMain
                    value={filters[column.key] || ""}
                    defaultText={`${column.title}`}
                    options={(column.filterOptions || []).map((opt, index) => ({
                      ...opt,
                      value: opt.value ?? `option-${index}`, // Fallback for undefined values
                    }))}
                    className="table-dropdown-select"
                    onChange={(e) =>
                      handleFilterChange(column.key, e.target.value)
                    }
                  />
                ) : (
                  <Input
                    placeholder={column.title}
                    value={filters[column.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(column.key, e.target.value)
                    }
                    className={styles.filterInput}
                  />
                )}
              </Box>
            );
          })}
          <Button type="button" onClick={handleApplyFilters} text="Search" />
        </Box>
      )}
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "10px",
          overflow: "hidden",
          padding: "20px 0px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
        className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1"
      >
        <TableContainer
          sx={{
            overflowX: "auto !important",
            "&::-webkit-scrollbar": {
              height: "10px",
              cursor: "grab", // This sets the hand icon for the scrollbar
            },
            // Optionally, add this to ensure the cursor applies to the scrollbar thumb as well
            "&::-webkit-scrollbar-thumb": {
              cursor: "grab",
            },
          }}
        >
          <Table
            className={styles.table}
            aria-labelledby="tableTitle"
            // maxContentWidth &&
            sx={{
              minWidth: maxContentWidth ? maxContentWidth : "100% !important",
            }}
          >
            <TableHead className={styles.table}>
              <TableRow>
                {enableRowSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < paginatedData.length
                      }
                      checked={
                        paginatedData.length > 0 &&
                        selected.length === paginatedData.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ "aria-label": "select all rows" }}
                      disabled={isLoading}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align="left"
                    padding="normal"
                    sortDirection={orderBy === column.key ? order : false}
                    className={enableSorting ? styles.sortable : ""}
                  >
                    {enableSorting ? (
                      <TableSortLabel
                        active={orderBy === column.key}
                        direction={orderBy === column.key ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, column.key)
                        }
                        disabled={isLoading}
                      >
                        {column.title}
                        {orderBy === column.key ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      column.title
                    )}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell align="left">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                skeletonRows.map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {enableRowSelection && (
                      <TableCell padding="checkbox">
                        <Skeleton
                          variant="rectangular"
                          width={24}
                          height={24}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} align="left">
                        <Skeleton
                          variant="text"
                          width={column.key === "trunkId" ? 80 : 100}
                          height={20}
                        />
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="left">
                        {actions.map((_, idx) => (
                          <Skeleton
                            key={`action-skeleton-${idx}`}
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{ display: "inline-block", mr: 1 }}
                          />
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (actions.length > 0 ? 1 : 0) +
                      (enableRowSelection ? 1 : 0)
                    }
                    align="center"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      onClick={() => onRowClick && onRowClick(row)} // Added row click handler
                      style={{ cursor: onRowClick ? "pointer" : "default" }}
                    >
                      {enableRowSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(event) => handleClick(event, row.id)}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key} align="left">
                          {row[column.key]}
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell align="left">
                          {actions.map((action, idx) => {
                            const tooltipText = action.tooltip
                              ? typeof action.tooltip === "function"
                                ? action.tooltip(row)
                                : action.tooltip
                              : "";

                            const iconButton = (
                              <IconButton
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row, e);
                                }}
                                className={action.className}
                              >
                                <Image
                                  src={
                                    action.icon2
                                      ? action.icon2(row)
                                      : action.icon || ""
                                  }
                                  alt="action icon"
                                />
                              </IconButton>
                            );

                            return tooltipText ? (
                              <Tooltip
                                key={idx}
                                title={tooltipText}
                                arrow
                                placement="top"
                              >
                                <span>{iconButton}</span>
                              </Tooltip>
                            ) : (
                              iconButton
                            );
                          })}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {enablePagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              overflow: "hidden",
              "& .MuiTablePagination-toolbar": {
                background: "#f5f8fb",
                borderRadius: "14px",
                boxShadow: "none",
                padding: "12px 20px",
                marginTop: "10px",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: 400,
                },
              "& .MuiTablePagination-actions button": {
                color: "var(--pri-color)",
                "&:disabled": {
                  color: "#ccc",
                },
              },
            }}
            disabled={isLoading}
          />
        )}
      </Paper>
    </Box>
  );
}
