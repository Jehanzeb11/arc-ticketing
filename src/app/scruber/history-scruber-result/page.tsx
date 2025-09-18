import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import ScrubHistoryResult from "@/components/pages/scruber/ScrubHistoryResult";
import React from "react";

const page = () => {
  return (
    <DefaultLayout>
      <DashboardHeader title="Scrubber > History > Results" />
      <ScrubHistoryResult />
    </DefaultLayout>
  );
};

export default page;
