"use client";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import AdminProfilePage from "./setting/AdminProfilePage";
import DashboardHeader from "../../../DashboardHeader";
export default function CompanyProfile() {
  return (
    <>
      {/* <ProfileHeader /> */}
      <DashboardHeader title="Company Profile Setting" />
      <AdminProfilePage title="Company Profile" />
    </>
  );
}
