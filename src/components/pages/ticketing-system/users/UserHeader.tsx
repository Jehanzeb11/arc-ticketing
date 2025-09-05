import Button from "@/components/common/Button/Button";
import { Grid, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

export default function UserHeader({ userCount, onClickModal }: any) {
  return (
    <Grid container sx={{ mb: "43px" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <h1 className="header-title">Portal users</h1>
        <Typography variant="body1" sx={{ mt: -1 }}>{`${
          userCount || 0
        } total`}</Typography>
      </Grid>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          text="Add New User"
          onClick={onClickModal}
          libIcon={<AddIcon />}
        />
        {/* <Button type="button" text='Add New' onClick={onClickModal} icon={AddIcon} /> */}
      </Grid>
    </Grid>
  );
}
