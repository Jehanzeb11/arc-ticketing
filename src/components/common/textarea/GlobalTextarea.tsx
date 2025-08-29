import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function GlobalTextarea({
  placeholder,
  value,
  onChange,
  required,
  srcImg,
  className,
  readOnly,
  label,
  rows,
  cols,
  ...rest
}: any) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      className={`input-parent ${className ? className : ""}`}
    >
      <label htmlFor={label}>{label}</label>
      <Box>
        <textarea
          className="form-control textarea"
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          cols={cols}
          value={value} // ✅ Fix here
          onChange={onChange} // ✅ Fix here
          {...rest}
        />
        {srcImg && <Image src={srcImg} alt="icon" className="icon" />}
      </Box>
    </Box>
  );
}
