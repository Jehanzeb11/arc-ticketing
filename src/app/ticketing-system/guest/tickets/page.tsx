"use client";
import DefaultLayout from "@/components/layout/DefaultLayout";
// import TicketView from "@/components/pages/ticketing-system/tickets/guest/ticketView";
import React from "react";

const TicketView = dynamic(
  () => import("@/components/pages/ticketing-system/tickets/guest/ticketView"),
  { ssr: false }
);
import dynamic from "next/dynamic";

export default function page() {
  return (
    <DefaultLayout>
      <TicketView />
    </DefaultLayout>
  );
}
