import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

const AuthInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    srcImg?: string;
    className?: string;
    sx?: any;
  }
>(({ placeholder, type, srcImg, className, sx, ...rest }, ref) => {
  return (
    <Box className={`form-group ${className || ""}`} sx={sx || {}}>
      <input
        type={type}
        placeholder={placeholder}
        className="form-control auth-input"
        ref={ref}
        {...rest} // includes name, onChange, value, etc.
      />
      {srcImg && <Image src={srcImg} alt="icon" className="icon-auth" />}
    </Box>
  );
})

AuthInput.displayName = "AuthInput";
export default AuthInput;
