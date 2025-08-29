"use client";
import React from "react";
import TableFilterSelect from "../../../common/Select/TableFilterSelect";
import FormSelect from "@/components/common/Select";
import { Grid } from "@mui/material";
import Button from "@/components/common/Button/Button";
import TableSelectFilterMain from "@/components/common/Select/TableSelectFilterMain";

function UserTableFilter() {
  const [country, setCountry] = React.useState("");

  const handleChange = (event) => {
    setCountry(event.target.value);
    // Add additional logic here if needed
  };

  const options = [
    { value: "role", label: "Role" },
    { value: "login", label: "Login" },
    { value: "status", label: "Status" },
    { value: "email", label: "Email" },
  ];

  return (
    <form action="" className="table-filter">
      <Grid
        container
        size={{ xs: 3 }}
        sx={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <Grid size={{ xs: 1.5 }}>
          <TableSelectFilterMain
            name="country"
            value={country}
            onChange={handleChange}
            options={options}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Button type="button" text="Search" />
        </Grid>
      </Grid>
    </form>
  );
}

export default UserTableFilter;
