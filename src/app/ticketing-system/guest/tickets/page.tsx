import DefaultLayout from "@/components/layout/DefaultLayout";
import TicketView from "@/components/pages/ticketing-system/tickets/guest/ticketView";
import React from "react";

export default function page() {
  return (
    <DefaultLayout>
      <TicketView />
    </DefaultLayout>
  );
}
