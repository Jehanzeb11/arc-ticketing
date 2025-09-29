"use client";
// import AddNewEntryEdit from "@/components/common/Form/roles-permission/AddNewEntryEdit";
import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const AddNewEntryEdit = dynamic(
  () => import("@/components/common/Form/roles-permission/AddNewEntryEdit"),
  { ssr: false }
);

const page = () => {
  return (
    <DefaultLayout>
      <Box>
        <DashboardHeader title="Roles Management" />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
        >
          <Typography variant="h5" className="header-title">
            Roles & Permissions
          </Typography>
        </Box>

        <AddNewEntryEdit />
      </Box>
    </DefaultLayout>
  );
};

export default page;
