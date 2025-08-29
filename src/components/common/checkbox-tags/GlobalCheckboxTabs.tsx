"use client";
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, IconButton } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// abc

interface Option {
  title: string;
  year?: number; // Optional, adjust based on your data structure
}

interface GlobalCheckboxTabsProps {
  options: Option[];
  label?: string;
  placeholder?: string;
  width?: string | number;
  onChange?: (selected: Option[]) => void; // Callback for selected values
  onDeleteOption?: (title: string) => void; // New callback for deleting an option
}

export default function GlobalCheckboxTabs({
  options,
  label,
  placeholder = "Select options",
  width = 500,
  onChange,
  onDeleteOption,
}: GlobalCheckboxTabsProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
  const [deleteMode, setDeleteMode] = React.useState<string | null>(null); // Track which option is in delete mode

  const handleChange = (event: React.SyntheticEvent, value: Option[]) => {
    setSelectedOptions(value);
    if (onChange) {
      console.log("GlobalCheckboxTabs onChange:", value); // Debug log
      onChange(value);
    }
  };

  const handleRemove = (title: string) => {
    const newSelected = selectedOptions.filter(
      (option) => option.title !== title
    );
    setSelectedOptions(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
    setDeleteMode(null); // Exit delete mode after removal
  };

  const handleDeleteConfirm = (title: string) => {
    if (onDeleteOption) {
      onDeleteOption(title); // Notify parent to delete from tagsOptions
    }
    handleRemove(title); // Remove from selectedOptions
  };

  const toggleDeleteMode = (title: string) => {
    setDeleteMode(deleteMode === title ? null : title); // Toggle delete mode for the clicked option
  };

  return (
    <Box sx={{ width }}>
      {label && (
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, fontWeight: 500, color: "#000" }}
        >
          {label}
        </Typography>
      )}
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
        renderTags={() => null} // Suppress chips inside the input
        value={selectedOptions}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={undefined} // Remove floating label
            placeholder={placeholder}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: { paddingTop: label ? "8px" : "12px" }, // Adjust padding if label is present
            }}
          />
        )}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
        className="Checkbox-selected-options"
      >
        {selectedOptions.map((option) => (
          <Box
            key={option.title}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 0.5,
              position: "relative",
            }} // Removed backgroundColor, borderRadius, and reduced padding
          >
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                cursor: "pointer",
                backgroundColor:
                  deleteMode === option.title ? "#E6EDFF" : "#F3F6FE",
                border:
                  deleteMode === option.title
                    ? "1px solid #32ABB1"
                    : "1px solid transparent",
                padding: "10px 20px",
                borderRadius: "10px",
              }}
              onClick={() => toggleDeleteMode(option.title)}
            >
              {option.title}
            </Typography>
            <IconButton
              size="small"
              onClick={() =>
                deleteMode === option.title
                  ? handleDeleteConfirm(option.title)
                  : handleRemove(option.title)
              }
              sx={{
                color: deleteMode === option.title ? "#fff" : "#ED1F34",
                backgroundColor:
                  deleteMode === option.title ? "#ED1F34" : "#F3F6FE",
              }} // Redder color for DeleteIcon
            >
              {deleteMode === option.title ? (
                <DeleteIcon fontSize="small" />
              ) : (
                <CloseIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
