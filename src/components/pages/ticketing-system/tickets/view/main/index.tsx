"use client";
import React, { useState } from "react";
import TicketCard from "./TicketCard";
import { Alert, AlertTitle, Box, Grid, Typography } from "@mui/material";
import Search from "@/components/common/search";
import ReplyForm from "./ReplyForm";
import ActivityLog from "./ActivityLog";
import TicketConversation from "./TicketConversation";
import profileImg from "@/assets/images/profile/small-profile.png";
import { useQuery } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";

export default function MainContent({
  ticketData,
  activityData,
  searchQuery,
  handleSearch,
  conversationData,
  allTickets,
}: any) {
  return (
    <Grid container spacing={2} sx={{ mt: 5 }}>
      <Grid
        size={{ lg: 3, xs: 12 }}
        sx={{ position: "sticky", top: "20px", height: "fit-content" }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <Search
              searchClass="ticket-search"
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              placeholder="Search tickets"
            />
          </Box>
          <Box
            sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                maxWidth: "100%",
                overflowY: "scroll",
                height: "100%",
              }}
            >
              {allTickets?.length > 0 ? (
                allTickets?.filter((ticket)=> !searchQuery || ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())).map((ticket, index) => (
                  <TicketCard
                    key={index}
                    id={ticket.id}
                    ticketId={ticket.ticket_reference}
                    status={ticket.status}
                    priority={ticket.priority}
                    title={ticket.subject}
                    name={ticket.assignee}
                    date={new Date(ticket.created_at).toLocaleString()}
                    imageUrl={ticket.imageUrl}
                  />
                ))
              ) : (
                <Typography>No ticket data available</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid
        size={{ lg: 6, xs: 12 }}
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <ReplyForm
          ticketId={ticketData?.id}
          tomails={ticketData?.to_email}
          c_mail={ticketData?.customer_email}
        />
        <Alert
          severity="error"
          sx={{ borderRadius: "10px", border: "1px solid #FF4242" }}
        >
          <AlertTitle>Auto-resolve scheduled</AlertTitle>
          This ticket will be automatically resolved on 2025-01-10 10:15 if no
          activity occurs.
        </Alert>
        <TicketConversation conversationData={ticketData?.replies} />
      </Grid>
      <Grid
        size={{ lg: 3, xs: 12 }}
        sx={{ position: "sticky", top: "20px", height: "fit-content" }}
      >
        <ActivityLog activityData={ticketData?.logs} />
      </Grid>
    </Grid>
  );
}
