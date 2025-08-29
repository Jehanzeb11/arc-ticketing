"use client";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import AdminProfilePage from "./setting/AdminProfilePage";
import DashboardHeader from "../../../DashboardHeader";
export default function ProfilePage() {
  return (
    <>
      {/* <ProfileHeader /> */}
      <DashboardHeader title="Admin Profile" />
      <AdminProfilePage title="Personal Information" />
    </>
  );
}
