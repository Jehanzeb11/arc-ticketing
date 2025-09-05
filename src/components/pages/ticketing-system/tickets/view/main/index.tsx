import React, { useState } from "react";
import TicketCard from "./TicketCard";
import { Alert, AlertTitle, Box, Grid, Typography } from "@mui/material";
import Search from "@/components/common/search";
import ReplyForm from "./ReplyForm";
import ActivityLog from "./ActivityLog";
import TicketConversation from "./TicketConversation";
import profileImg from "@/assets/images/profile/small-profile.png";

export default function MainContent({
  ticketData,
  activityData,
  searchQuery,
  handleSearch,
  conversationData,
}: any) {
  return (
    <Grid container spacing={2} sx={{ mt: 5 }}>
      <Grid
        size={{ lg: 3, xs: 12 }}
        sx={{ position: "sticky", top: "20px", height: "fit-content" }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <Search searchQuery={searchQuery} handleSearch={handleSearch} />
          </Box>

          {ticketData?.length > 0 ? (
            ticketData.map((ticket, index) => (
              <TicketCard
                key={index}
                ticketId={ticket.ticketId}
                status={ticket.Status}
                priority={ticket.Priority}
                title={ticket.Title}
                name={ticket.Assignee}
                date={ticket.Created}
                imageUrl={ticket.imageUrl}
              />
            ))
          ) : (
            <Typography>No ticket data available</Typography>
          )}
        </Box>
      </Grid>
      <Grid
        size={{ lg: 6, xs: 12 }}
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <ReplyForm ticketId={ticketData.id} />
        <Alert
          severity="error"
          sx={{ borderRadius: "10px", border: "1px solid #FF4242" }}
        >
          <AlertTitle>Auto-resolve scheduled</AlertTitle>
          This ticket will be automatically resolved on 2025-01-10 10:15 if no
          activity occurs.
        </Alert>
        {/* <TicketConversation conversationData={conversationData} /> */}
      </Grid>
      <Grid
        size={{ lg: 3, xs: 12 }}
        sx={{ position: "sticky", top: "20px", height: "fit-content" }}
      >
        {/* <ActivityLog activityData={activityData} /> */}
      </Grid>
    </Grid>
  );
}
