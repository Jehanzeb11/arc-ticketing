import DefaultLayout from "@/components/layout/DefaultLayout";
import CompanyProfile from "@/components/pages/ticketing-system/users/company-profile";
import ProfilePage from "@/components/pages/ticketing-system/users/profle";
import React from "react";

export default function page() {
  return (
    <DefaultLayout>
      <CompanyProfile />
    </DefaultLayout>
  );
}
