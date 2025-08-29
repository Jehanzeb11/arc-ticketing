"use client";

import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Forward ref for react-hook-form compatibility
const GlobalPasswordInput = React.forwardRef<HTMLInputElement, any>(
  (
    {
      placeholder,
      name,
      required,
      label,
      className,
      sx,
      readOnly,
      onBlur,
      value,
      onChange,
      setValue, // ✅ receive this from props
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let newPassword = "";
      for (let i = 0; i < 12; i++) {
        newPassword += chars[Math.floor(Math.random() * chars.length)];
      }

      if (setValue && name) {
        setValue(name, newPassword); // ✅ Proper react-hook-form update
      } else {
        onChange?.({ target: { value: newPassword } });
      }
    };

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", ...sx }}
        className={`input-parent ${className || ""}`}
      >
        <label htmlFor={name}>{label}</label>
        <Box sx={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            ref={ref}
            className="form-control"
            placeholder={placeholder}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            {...rest}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              display: "flex",
              gap: "8px",
            }}
          >
            <IconButton onClick={generatePassword} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              size="small"
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default GlobalPasswordInput;
