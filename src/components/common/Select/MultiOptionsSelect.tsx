import React from "react";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Props = {
  options: string[];
  label?: string; // optional
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  sx?: object;
  disabled?: boolean; // Added disabled prop
};

export default function MultiOptionsSelect({
  options = [], // ✅ default empty array
  label,
  placeholder = "Select...",
  value,
  onChange,
  sx = {},
  disabled = false, // Default to false
}: Props) {
  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const {
      target: { value: selected },
    } = event;
    onChange(typeof selected === "string" ? selected.split(",") : selected);
  };

  return (
    <FormControl sx={{ m: 1, width: 300, ...sx }} disabled={disabled}>
      {/* Only show label if provided */}
      {label && (
        <InputLabel shrink={false} id="multi-select-label">
          {label}
        </InputLabel>
      )}
      <Select
        labelId="multi-select-label"
        multiple
        value={value}
        onChange={handleChange}
        displayEmpty
        input={<OutlinedInput notched={false} />} // remove floating effect
        renderValue={(selected) =>
          selected.length === 0 ? placeholder : selected.join(", ")
        }
        MenuProps={MenuProps}
        disabled={disabled} // Pass disabled prop to Select
      >
        {options.map((name) => (
          <MenuItem key={name} value={name} disabled={disabled}>
            <Checkbox checked={value.includes(name)} disabled={disabled} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}