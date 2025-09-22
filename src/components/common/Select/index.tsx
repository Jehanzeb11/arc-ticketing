"use client";

import {
  Autocomplete,
  TextField,
  Box,
  Popper,
  CircularProgress,
} from "@mui/material";
import React from "react";
import Image from "next/image";

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: any; // Icon source (e.g., SVG import)
}

interface FormSelectProps {
  onChange: (event: any) => void;
  value?: string | string[]; // 👈 string for single, string[] for multiple
  label?: string;
  name?: string;
  description?: string;
  options?: Option[];
  className?: string;
  explanationText?: string | boolean;
  defaultText?: string;
  popperClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  sx?: any;
  multiple?: boolean; // 👈 add this
}

export default function FormSelect({
  onChange,
  value = "",
  label = "",
  name = "",
  description = "",
  options = [],
  className = "",
  explanationText = false,
  defaultText = "",
  disabled = false,
  sx,
  popperClassName,
  loading = false,
  multiple = false, // 👈 default false
}: FormSelectProps) {
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        placement="top-start"
        className={`custom-autocomplete-popper ${popperClassName || ""}`}
        modifiers={[]}
        style={{
          ...props.style,
          top: "auto",
          bottom: `calc(100% + 8px)`, // Push it above the input
          transform: "none", // cancel Popper.js's transform
        }}
      />
    );
  };

  return (
    <Box className={`my-select ${className ? className : ""}`} sx={{ ...sx }}>
      <span className="select-label">{label}</span>
      <Autocomplete
        multiple={multiple} // 👈 toggle multi-select
        disableCloseOnSelect={multiple}
        options={options || []}
        getOptionLabel={(option) => option.label || defaultText}
        value={
          multiple
            ? options.filter((opt) => (value as string[])?.includes(opt.value))
            : options.find((opt) => opt.value === value) || null
        }
        PopperComponent={CustomPopper}
        disableClearable // 👈 removes the clear icon
        clearIcon={null}
        onChange={(event, newValue) => {
          if (multiple) {
            // For multi-select -> array of values
            onChange({
              target: {
                name,
                value: newValue.map((nv: Option) => nv.value),
              },
            });
          } else {
            // For single select -> single value
            onChange({
              target: {
                name,
                value: newValue ? newValue.value : "",
              },
            });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={defaultText}
            variant="outlined"
            className="form-select"
            fullWidth
            margin="normal"
            disabled={disabled || loading}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.value}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {option.icon && (
                <Image
                  src={option.icon.src}
                  alt={`${option.label} icon`}
                  width={20}
                  height={20}
                />
              )}
              <span>{option.label}</span>
            </Box>
            {option.description && (
              <span style={{ color: "#00000033" }}>({option.description})</span>
            )}
          </li>
        )}
        isOptionEqualToValue={(option, val) =>
          option.value === (multiple ? val.value : val?.value)
        }
        className="autocomplete-select"
        disabled={disabled || loading}
      />
      {explanationText && (
        <p
          className="explanation-text"
          style={{ color: "#666", marginTop: "4px", fontSize: "12px" }}
        >
          {explanationText}
        </p>
      )}
    </Box>
  );
}
