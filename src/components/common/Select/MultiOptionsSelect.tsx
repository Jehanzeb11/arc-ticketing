import React from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Popper,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Image from "next/image";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: any; // Icon source (e.g., SVG import)
}

interface MultiSelectProps {
  onChange: (event: any) => void;
  value?: string[]; // Value as an array of selected values for multi-select
  label?: string;
  name?: string;
  description?: string;
  options?: Option[];
  className?: string;
  explanationText?: string | boolean;
  defaultText?: string;
  loading?: boolean;
  disabled?: boolean;
  sx?: any;
}

export default function MultiSelect({
  onChange,
  value = [],
  label = "",
  name = "",
  description = "",
  options = [],
  className = "",
  explanationText = false,
  defaultText = "",
  loading = false,
  disabled = false,
  sx,
}: MultiSelectProps) {
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        placement="top-start"
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: Option[]) => {
    onChange({
      target: {
        name,
        value: newValue.map((nv: Option) => nv.value),
      },
    });
  };

  return (
    <Box className={`my-select ${className}`} sx={{ ...sx }}>
      <span className="select-label">{label}</span>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options || []}
        getOptionLabel={(option) => option.label || defaultText}
        value={options.filter((opt) => value.includes(opt.value))} // This ensures the value array is correctly mapped
        PopperComponent={CustomPopper}
        disableClearable
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={defaultText}
            variant="outlined"
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
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            key={option.value}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected} // Use selected here to set checked state
              style={{ marginRight: 8 }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
        isOptionEqualToValue={(option, val) => option.value === val}
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
