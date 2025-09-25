"use client";

import React, { useState } from "react";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface FilterSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Filter By Status",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormControl
      sx={{
        minWidth: 175,
        "& .MuiOutlinedInput-root": {
          borderRadius: "9999px",
          border: "1.5px solid #C4C4C4",
          paddingRight: "12px",
        },
        "& fieldset": {
          border: "none",
        },
        "& .MuiSelect-select": {
          padding: "10px 16px",
          fontSize: "14px",
          color: value ? "#333" : "#757575",
        },
        "& .MuiSelect-icon": {
          right: "12px",
        },
      }}
    >
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        IconComponent={() =>
          open ? (
            <KeyboardArrowUpIcon
              sx={{ transition: "0.2s" }}
              onClick={() => setOpen(false)}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ transition: "0.2s" }}
              onClick={() => setOpen(true)}
            />
          )
        }
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ color: "#757575", fontSize: "14px" }}>
                {placeholder}
              </span>
            );
          }
          const option = options.find((opt) => opt.value === selected);
          return option ? option.label : selected;
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
