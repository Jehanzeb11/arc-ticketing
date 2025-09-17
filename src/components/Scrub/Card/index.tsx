import { Box, Typography } from "@mui/material";
import React from "react";

const ScrubCard = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        p: 4,
        borderRadius: "12px",
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", mb: 1.5, fontSize: "28px" }}
        >
          {props.title}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {props.desc}
        </Typography>
      </Box>

      <Box sx={{ my: 2, border: ".5px solid #0000001d" }}></Box>

      {children}
    </Box>
  );
};

export default ScrubCard;
