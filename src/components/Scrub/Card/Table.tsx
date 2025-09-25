import { Box, Typography } from "@mui/material";
import React from "react";

const ScrubCardTable = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        p: 4,
        borderRadius: "12px",
        mb: 4,
      }}
      className="scrub-table"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
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
        <Box
          sx={{ display: "flex", gap: "14px", fontSize: "14px" }}
          className="scrub-filters"
        >
          {props.filters}
        </Box>
      </Box>

      {children}
    </Box>
  );
};

export default ScrubCardTable;
