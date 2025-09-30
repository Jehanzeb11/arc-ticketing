import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import ScrubHistory from "@/components/pages/scruber/ScrubHistorySingle";
import React from "react";

const page = () => {
  return (
    <DefaultLayout>
      <DashboardHeader title="Phone Number Scrubber" />
      <ScrubHistory />
    </DefaultLayout>
  );
};

export default page;
