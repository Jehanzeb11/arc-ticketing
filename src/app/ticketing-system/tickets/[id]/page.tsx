import DefaultLayout from "@/components/layout/DefaultLayout";
import ViewUniBoxTicket from "@/components/pages/ticketing-system/tickets/view";
import React from "react";

export default function page({ params }: any) {
  const id = params;
  return (
    <DefaultLayout>
      <ViewUniBoxTicket ticketId={id} />
    </DefaultLayout>
  );
}
