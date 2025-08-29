import * as React from "react";
import { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";
import Image from "next/image";

// Forward ref for react-hook-form to properly manage input refs
const GlobalDatePickerInput = React.forwardRef<HTMLInputElement, any>(
  (
    {
      placeholder,
      type, // Ignored, as DatePicker doesn't use type
      name,
      required,
      srcImg,
      className,
      readOnly,
      label,
      sx,
      onBlur,
      // The rest props from react-hook-form (value, onChange, etc.)
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = React.useState<Dayjs | null>(null);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, ...sx }}
          className={`input-parent ${className ? className : ""}`}
        >
          {label && <label htmlFor={name}>{label}</label>}
          <DemoContainer components={["DatePicker"]}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <DatePicker
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                  // Trigger react-hook-form's onChange if provided
                  if (rest.onChange) {
                    rest.onChange(newValue);
                  }
                }}
                readOnly={readOnly}
                slotProps={{
                  // textField: {
                  //   name,
                  //   required,
                  //   placeholder,
                  //   onBlur,
                  //   inputRef: ref, // Pass the ref for react-hook-form
                  //   sx: {
                  //     "& .MuiInputBase-root": {
                  //       borderRadius: "8px",
                  //       backgroundColor: "white",
                  //       "&:hover": {
                  //         borderColor: "#3b82f6", // Tailwind's blue-500
                  //       },
                  //     },
                  //     "& .MuiInputLabel-root": {
                  //       color: "#6b7280", // Tailwind's gray-500
                  //       fontWeight: "medium",
                  //     },
                  //   },
                  //   ...rest, // Spread react-hook-form props (e.g., value, onChange)
                  // },
                  openPickerButton: {
                    // Custom icon if srcImg is provided
                    children: srcImg ? (
                      <Image
                        src={srcImg}
                        alt="calendar icon"
                        width={24}
                        height={24}
                        className="icon"
                      />
                    ) : undefined,
                  },
                }}
              />
            </Box>
          </DemoContainer>
        </Box>
      </LocalizationProvider>
    );
  }
);

GlobalDatePickerInput.displayName = "GlobalDatePickerInput";
export default GlobalDatePickerInput;