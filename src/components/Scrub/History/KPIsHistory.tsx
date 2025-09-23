import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import icon7 from "@/assets/scruber/icons/history-1.png";
import icon8 from "@/assets/scruber/icons/history-2.png";
import icon9 from "@/assets/scruber/icons/history-3.png";
import icon10 from "@/assets/scruber/icons/history-4.png";
import Image from "next/image";
const KPIsHistory = ({ data }) => {
  const totalProcessed = data?.reduce((sum, job) => sum + job.totalNumbers, 0);
  const totalBad = data?.reduce((sum, job) => sum + job.badNumbers, 0);
  const totalValid = totalProcessed - totalBad;

  return (
    <Grid
      container
      spacing={2}
      mt={4}
      p={3}
      bgcolor={"#E9EAF9"}
      sx={{ borderRadius: "12px" }}
    >
      <Grid
        size={3}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon7} alt="icon7" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", mb: 0.5, fontSize: "24px" }}
          >
            {data?.length || 0}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Total Uploads
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={3}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon8} alt="icon8" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", mb: 0.5, fontSize: "24px" }}
          >
            {totalProcessed}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Total Numbers Processed
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={3}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon9} alt="icon9" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", mb: 0.5, fontSize: "24px" }}
          >
            {totalBad}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Total Bad Numbers
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={3}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon10} alt="icon10" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "600", mb: 0.5, fontSize: "24px" }}
          >
            {totalValid}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Total Valid Numbers
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default KPIsHistory;
