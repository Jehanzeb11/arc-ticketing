"use client";

import React from "react";
import {
  Radio,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@/assets/icons/modal/info.svg";
import Image from "next/image";
import { useController, Control, FieldValues } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface GlobalRadioInputProps<T extends FieldValues> {
  options: Option[];
  name: string;
  control: Control<T>;
  rules?: any;
  showTooltip?: boolean;
  tooltipTitles?: string[];
  disabled?: boolean;
  className?: string;
}

const GlobalRadioInput = <T extends FieldValues>({
  options,
  name,
  control,
  rules,
  showTooltip = false,
  tooltipTitles = [],
  disabled = false,
  className = "",
}: GlobalRadioInputProps<T>) => {
  if (!control) {
    console.error(
      `Control is undefined for GlobalRadioInput with name: ${name}`
    );
    return (
      <div className="radio-container">
        <p style={{ color: "#B80505" }}>
          Error: Form control is not initialized.
        </p>
      </div>
    );
  }

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: "",
    rules,
  });

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.value);
  };

  return (
    <FormControl
      component="fieldset"
      className={`radio-container ${className}`}
      error={!!fieldState.error}
    >
      <RadioGroup
        name={name}
        value={field.value || ""}
        onChange={handleRadioChange}
      >
        {options.map((item, index) => (
          <div
            key={`${name}-${item.value}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <FormControlLabel
              value={item.value}
              control={<Radio disabled={disabled} />}
              label={item.label}
            />
            {showTooltip && tooltipTitles[index] && (
              <Tooltip title={tooltipTitles[index]}>
                <IconButton size="small">
                  <Image src={InfoIcon} alt="Info" width={16} height={16} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </RadioGroup>
      {fieldState.error && (
        <p style={{ color: "#B80505", margin: "10px 0 0 0" }}>
          {fieldState.error.message}
        </p>
      )}
    </FormControl>
  );
};

export default GlobalRadioInput;
