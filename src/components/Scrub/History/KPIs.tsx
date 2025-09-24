import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import icon1 from "@/assets/scruber/icons/1.png";
import icon2 from "@/assets/scruber/icons/2.png";
import icon3 from "@/assets/scruber/icons/3.png";
import icon4 from "@/assets/scruber/icons/4.png";
import icon5 from "@/assets/scruber/icons/5.png";
import icon6 from "@/assets/scruber/icons/6.png";
import icon7 from "@/assets/scruber/icons/7.svg";
import icon8 from "@/assets/scruber/icons/8.png";
import icon9 from "@/assets/scruber/icons/ocn-icon.svg";
import icon10 from "@/assets/scruber/icons/10.png";
import Image from "next/image";
const ScruberKPIsResult = ({
  validatorCounts,
  totalNumbers,
  badNumbers,
  goodNumbers,
}) => {
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
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon1} alt="icon1" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {totalNumbers}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Total Numbers
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon2} alt="icon2" />

        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {goodNumbers}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Valid Numbers
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon3} alt="icon3" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {badNumbers}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Bad Numbers
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon4} alt="icon4" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts.tcpa}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            TCPA / TCPA Troll
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon5} alt="icon5" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts.dnc_complainers}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            DNS Complainers
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
        sx={{
          backgroundColor: "white",
          borderRadius: "23px",
          p: 2.7,
          display: "flex",
          gap: "12px",
        }}
      >
        <Image width={57} height={57} src={icon6} alt="icon6" />
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts["Federal DNC"]}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Federal DNC
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
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
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts.state_dnc}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            State DNC
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
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
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts["Verizon Wireless"]}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Verizon Wireless
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
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
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts["Telnyx OCN"]}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            Telnyx OCN
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={2.4}
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
            sx={{ fontWeight: "500", mb: 0.5, fontSize: "24px" }}
          >
            {validatorCounts && validatorCounts["DNC Trolls"]}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: "400", fontSize: "13px" }}
          >
            DNC Trolls
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ScruberKPIsResult;
