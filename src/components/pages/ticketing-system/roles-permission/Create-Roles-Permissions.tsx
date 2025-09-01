import { Box, Typography } from "@mui/material";
import React from "react";
import DashboardHeader from "../../DashboardHeader";
import AddNewEntry from "@/components/common/Form/roles-permission/AddNewEntry";

const CreateRolesPermissions = () => {
  return (
    <Box>
      <DashboardHeader title="Roles Management" />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
      >
        <Typography variant="h5" className="header-title">
          Roles & Permissions
        </Typography>
      </Box>

      <AddNewEntry />
    </Box>
  );
};

export default CreateRolesPermissions;
