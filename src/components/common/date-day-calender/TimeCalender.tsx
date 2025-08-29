import React from "react";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";

// Forward ref for react-hook-form to properly manage input refs
const TimeSelector = React.forwardRef<any, any>(
  (
    {
      control,
      name,
      label,
      defaultValue = dayjs("2022-04-17T15:30"),
      className,
      sx,
      srcImg,
      ...rest
    },
    ref
  ) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ...sx,
              }}
              className={`time-picker-parent ${className ? className : ""}`}
            >
              <label htmlFor={name}>{label}</label>
              <Box>
                <TimePicker
                  label={null} // Remove the default floating label
                  value={value}
                  onChange={(newValue) => onChange(newValue)}
                  defaultValue={defaultValue}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                      InputLabelProps: { shrink: false }, // Disable label shrink/transition
                    },
                  }}
                  {...rest}
                />
                {srcImg && <Image src={srcImg} alt="icon" className="icon" />}
              </Box>
            </Box>
          )}
        />
      </LocalizationProvider>
    );
  }
);

// This is necessary for forwarding refs to work
TimeSelector.displayName = "TimeSelector";

export default TimeSelector;
