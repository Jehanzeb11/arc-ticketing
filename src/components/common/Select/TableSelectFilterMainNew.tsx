"use client";
import { Autocomplete, TextField, Box, Popper, MenuItem } from "@mui/material";
import React from "react";
import Image from "next/image";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
interface Option {
  value: string;
  label: string;
  icon?: string;
}

export default function TableSelectFilterMainNew({
  onChange,
  value = "",
  name = "",
  options = [],
  className = "",
  defaultText = "Select an option",
  menuItemSx,
  sx,
  popperClassName,
}: any) {
  const selectedOption =
    value !== ""
      ? options?.find((option) => option.value === value) || null
      : null;
  const [open, setOpen] = React.useState(true);
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        className={`custom-autocomplete-popper ${popperClassName || ""}`}
        // sx={{
        //   '& .MuiAutocomplete-listbox': {
        //     maxHeight: '200px'
        //   }
        // }}
      />
    );
  };

  const getPriorityColor = (label: string) => {
    switch (label) {
      case "Low":
        return "#9e9e9e";
      case "Medium":
        return "#fbc02d";
      case "High":
        return "#1976d2";
      case "Urgent":
        return "#d32f2f";
      default:
        return "inherit";
    }
  };

  console.log(selectedOption);

  return (
    <Box
      className={`my-select ${name} ${selectedOption?.value} ${
        className ? className : ""
      }`}
      sx={{ ...sx }}
    >
      <Autocomplete
        disableClearable={true}
        options={options || []}
        getOptionLabel={(option) => option.label || defaultText}
        value={selectedOption}
        PopperComponent={CustomPopper}
        // open={open}
        // onOpen={() => setOpen(true)}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name,
              value: newValue ? newValue.value : "",
            },
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={defaultText}
            variant="outlined"
            className="form-select"
            fullWidth
            margin="normal"
            InputProps={{
              ...params.InputProps,
              // startAdornment: selectedOption?.icon ? (
              //   <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              //     <Image
              //       src={selectedOption.icon}
              //       alt={`${selectedOption.label} icon`}
              //       style={{ objectFit: "contain" }}
              //     />
              //   </Box>
              // ) : null,
              endAdornment: params.InputProps.endAdornment,
            }}
          />
        )}
        renderOption={(props, option, { selected }) => {
          // Priority colors

          return (
            <MenuItem
              {...props}
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color:
                  name === "Priority" && option.value !== "All"
                    ? getPriorityColor(option.label)
                    : selected &&
                      popperClassName?.split(" ")[0] == "ticket-table-dropdown"
                    ? "#3F8CFF"
                    : "inherit",
                fontWeight: selected ? 600 : 400,
                ...menuItemSx,
              }}
            >
              {/* Blue checkmark only if selected */}
              {selected &&
                name != "Assignee" &&
                popperClassName?.split(" ")[0] == "ticket-table-dropdown" && (
                  <CheckOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color:
                        name === "Priority"
                          ? getPriorityColor(option.label)
                          : "#3F8CFF",
                    }}
                  />
                )}

              {option.icon && (
                <Image
                  src={option.icon}
                  alt={`${option.label} icon`}
                  width={20}
                  height={20}
                  style={{ objectFit: "contain" }}
                />
              )}

              {option.label}
            </MenuItem>
          );
        }}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        className="autocomplete-select"
      />
    </Box>
  );
}
