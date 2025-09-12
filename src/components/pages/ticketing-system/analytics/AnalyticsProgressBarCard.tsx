import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import React from "react";

function AnalyticsProgressBarCard({ analyticsData }) {
  const data = analyticsData.slice(0, 5)?.map((item) => ({
    name: item.username,
    value: item.avgResponseTime,
    color:
      item.avgResponseTime >= 75
        ? "#0AC947"
        : item.avgResponseTime >= 50
        ? "#FFBD21"
        : "#FF293D",
  }));

  // Assuming a max time of 100 minutes for normalization
  const maxTime = 100;

  return (
    <Grid container spacing={2} sx={{ mt: "20px" }}>
      <Grid size={{ xs: 6 }}>
        <Box sx={{ p: "30px 23px", bgcolor: "#fff", borderRadius: "17px" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "30px", // 125%
              mb: "35px",
            }}
          >
            Agent Resolution Rate Comparison
          </Typography>
          {data.map((item) => (
            <Box
              key={item.name}
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "var(--Main-Heading, #404040)",
                  fontSize: "15px",
                  fontWeight: 500,
                  lineHeight: "23.412px", // 156.081%
                  textTransform: "capitalize",
                  width: "90px",
                }}
              >
                {item.name}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 18,
                  borderRadius: 5,
                  flexGrow: 1,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                  },
                }}
              />
              <Typography variant="body1">{item.value}%</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Box sx={{ p: "30px 23px", bgcolor: "#fff", borderRadius: "17px" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "30px", // 125%
              mb: "35px",
            }}
          >
            Average Response Time by Agent
          </Typography>
          {data.map((item) => {
            // Normalize time to percentage (assuming maxTime as 100 minutes)
            const normalizedValue = (item.value / maxTime) * 100;
            return (
              <Box
                key={item.name}
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--Main-Heading, #404040)",
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "23.412px", // 156.081%
                    textTransform: "capitalize",
                    width: "90px",
                  }}
                >
                  {item.name}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={normalizedValue > 100 ? 100 : normalizedValue}
                  sx={{
                    height: 18,
                    borderRadius: 5,
                    flexGrow: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: item.color,
                    },
                  }}
                />
                <Typography variant="body1">{item.value}m</Typography>
              </Box>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AnalyticsProgressBarCard;
