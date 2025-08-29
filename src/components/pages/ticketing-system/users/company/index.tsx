"use client";
import { useRef, useState } from "react";
import ProfileImg from "@/assets/images/profile/profile-img.png";
import Image from "next/image";
import Button from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import FormSelect from "@/components/common/Select";
import InfoIcon from "@/assets/icons/modal/info.svg";
const CompanyPage = () => {
  const [dateTimeFormat, setDateTimeFormat] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  return (
    <div>
      <h1>Company info</h1>
      <form className="company-form">
        <Grid container>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Company Name"
                  placeholder="Clark England Trading"
                />
              </Grid>
              <Grid
                size={{ xs: 12 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <h2>General information</h2>
                <Tooltip title="Info">
                  <IconButton>
                    <Image src={InfoIcon} alt="Info" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Salutation"
                  placeholder="Exercitationem "
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="First name"
                  placeholder="Lacey"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Middle name"
                  placeholder="Conan Lyons"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Last name"
                  placeholder="Montoya"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="email"
                  label="Email address"
                  placeholder="mHc6V@example.com"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="number"
                  label="Fax"
                  placeholder="+1 (396) 537-9332"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="number"
                  label="Phone"
                  placeholder="+1 (396) 537-9332"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <FormSelect
                  label="Date and Time Format"
                  name="date-time-format"
                  value={dateTimeFormat}
                  onChange={(e) => setDateTimeFormat(e.target.value)}
                  options={[
                    {
                      label: "01.07.2025 11:37:44 AM",
                      value: "01.07.2025 11:37:44 AM",
                    },
                    {
                      label: "02.07.2025 11:37:44 AM",
                      value: "02.07.2025 11:37:44 AM",
                    },
                    {
                      label: "03.07.2025 11:37:44 AM",
                      value: "03.07.2025 11:37:44 AM",
                    },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}sx={{ display: "flex", alignItems: "center" }}>
                <h2>Address</h2>
                <Tooltip title="Info">
                  <IconButton>
                    <Image src={InfoIcon} alt="Info" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <FormSelect
                  label="Country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  options={[
                    {
                      label: "Andorra",
                      value: "Andorra",
                    },
                    {
                      label: "United States",
                      value: "United States",
                    },
                    {
                      label: "United Kingdom",
                      value: "United Kingdom",
                    },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="City"
                  placeholder="Birnin Zana"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Address line 1"
                  placeholder=" Royal Palace"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Address line 2"
                  placeholder=" 123 Vibranium Way"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="number"
                  label="Postal code"
                  placeholder="123456"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <FormSelect
                  label="Province/state"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  options={[
                    {
                      label: "Alabama",
                      value: "Alabama",
                    },
                    {
                      label: "Alaska",
                      value: "Alaska",
                    },
                    {
                      label: "Arizona",
                      value: "Arizona",
                    },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ display: "flex", alignItems: "center" }}>
                <h2>Additional contact</h2>
                <Tooltip title="Info">
                  <IconButton>
                    <Image src={InfoIcon} alt="Info" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Contact person"
                  placeholder="T`Challa Udaku"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  type="text"
                  label="Additional phone"
                  placeholder="+1 (555) 123-4567"
                />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ mt: "30px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: "15px", alignItems: "center" }}
                  >
                    <Button type="button" text="Cancel" btntrasnparent={true} />
                    <Button type="submit" text="Save Changes" />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CompanyPage;
