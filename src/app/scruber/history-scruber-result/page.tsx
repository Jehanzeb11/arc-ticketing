"use client";
import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import ScrubHistoryResult from "@/components/pages/scruber/ScrubHistoryResult";
import dynamic from "next/dynamic";
import React from "react";

const DynamicResult = dynamic(
  () => import("@/components/pages/scruber/ScrubHistoryResult"),
  { ssr: false }
);

const page = () => {
  return (
    <DefaultLayout>
      <DashboardHeader title="Scrubber > History > Results" />
      <DynamicResult />
    </DefaultLayout>
  );
};

export default page;
