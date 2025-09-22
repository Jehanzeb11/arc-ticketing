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

// Types
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
  Pagination?: React.ReactNode;
}

type Order = "asc" | "desc";

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  actions,
  Pagination,
  rowsPerPage = 8, // default page size
}) => {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);

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

  // Pagination logic
  const startIndex = page * rowsPerPage || 0;
  const endIndex = Math.min(startIndex + rowsPerPage, sortedData?.length) || 0;
  const paginatedData = Pagination ? sortedData?.slice(startIndex, endIndex) : sortedData;

  const handleNext = () => {
    if (endIndex < sortedData.length) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
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
      {Pagination && (
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
              {`${startIndex + 1}-${endIndex} of ${sortedData?.length}`}
            </Typography>
            <IconButton onClick={handlePrev} disabled={page === 0}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              disabled={endIndex >= sortedData?.length}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReusableTable;
