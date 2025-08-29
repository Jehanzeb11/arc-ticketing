import DefaultLayout from "@/components/layout/DefaultLayout";
import ArchiveTicketsPage from "@/components/pages/ticketing-system/tickets/archive";
import React from "react";

export default function page() {
  return (
    <DefaultLayout>
      <ArchiveTicketsPage />
    </DefaultLayout>
  );
}
