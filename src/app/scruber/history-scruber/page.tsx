import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import ScrubHistory from "@/components/pages/scruber/ScrubHistory";
import React from "react";

const page = () => {
  return (
    <DefaultLayout>
      <DashboardHeader title="Scrubber > History " />
      <ScrubHistory />
    </DefaultLayout>
  );
};

export default page;
