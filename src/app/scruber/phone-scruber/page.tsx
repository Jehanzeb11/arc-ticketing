import DefaultLayout from "@/components/layout/DefaultLayout";
import DashboardHeader from "@/components/pages/DashboardHeader";
import PhoneScrube from "@/components/pages/scruber/PhoneScruber";
import React from "react";

const PhoneScruber = () => {
  return (
    <DefaultLayout>
      <DashboardHeader title="Phone Scrub" />
      <PhoneScrube />
    </DefaultLayout>
  );
};

export default PhoneScruber;
