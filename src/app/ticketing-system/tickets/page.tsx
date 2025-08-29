// React imports
import React from "react";

// Layout and component imports
import DefaultLayout from "@/components/layout/DefaultLayout";
import UniBoxTickets from "@/components/pages/ticketing-system/tickets";

export default function TicketsPage() {
  return (
    <DefaultLayout>
      <UniBoxTickets />
    </DefaultLayout>
  );
}
