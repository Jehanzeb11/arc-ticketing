"use client";
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
  rowsPerPage?: number;

  /** New props for server pagination */
  serverPagination?: boolean;
  page?: number; // controlled page (from parent if serverPagination)
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
}

type Order = "asc" | "desc";

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  actions,
  rowsPerPage = 8,
  serverPagination = false,
  page: controlledPage,
  totalItems,
  onPageChange,
}) => {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [localPage, setLocalPage] = useState(0);

  const currentPage = serverPagination ? controlledPage || 1 : localPage + 1;

  const handleSort = (colKey: string) => {
    const isAsc = orderBy === colKey && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colKey);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal === undefined || bVal === undefined) return 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return order === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, orderBy, order]);

  // Client pagination (only slice if not serverPagination)
  const startIndex = serverPagination
    ? (currentPage - 1) * rowsPerPage
    : localPage * rowsPerPage;
  const endIndex = serverPagination
    ? startIndex + data?.length
    : Math.min(startIndex + rowsPerPage, sortedData?.length);
  const paginatedData = serverPagination
    ? sortedData // backend already gives current page slice
    : sortedData?.slice(startIndex, endIndex);

  // Handlers
  const handleNext = () => {
    if (serverPagination) {
      if (onPageChange && endIndex < (totalItems || 0)) {
        onPageChange(currentPage + 1);
      }
    } else {
      if (endIndex < sortedData?.length) setLocalPage((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (serverPagination) {
      if (onPageChange && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    } else {
      if (localPage > 0) setLocalPage((p) => p - 1);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 0 }}>
        <Table className="table-scrub" sx={{ border: "1px solid #E2E8F0" }}>
          <TableHead
            sx={{
              background:
                "linear-gradient(90deg, #fff 100%, #3286BDB2 100%) !important",
              height: "80px",
              border: "none",
            }}
          >
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ fontWeight: "500", background: "#f5f9fc" }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ fontWeight: "500", background: "#f5f9fc" }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData?.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{ fontSize: "14px", color: "#4B5563" }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Footer */}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 2,
            gap: 1,
            background: "#f5f9fc",
            width: "fit-content",
            pl: 2,
            borderRadius: "10px",
          }}
        >
          <Typography sx={{ fontSize: "14px", color: "#374151" }}>
            {serverPagination
              ? `${startIndex + 1}-${endIndex} of ${totalItems || 0}`
              : `${startIndex + 1}-${endIndex} of ${sortedData?.length}`}
          </Typography>
          <IconButton onClick={handlePrev} disabled={currentPage === 1}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={
              serverPagination
                ? endIndex >= (totalItems || 0)
                : endIndex >= sortedData?.length
            }
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ReusableTable;
