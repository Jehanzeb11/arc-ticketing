import DefaultLayout from "@/components/layout/DefaultLayout";
import DeleteTicketsPage from "@/components/pages/ticketing-system/tickets/delete";
import React from "react";

export default function page() {
  return (
    <DefaultLayout>
      <DeleteTicketsPage />
    </DefaultLayout>
  );
}
