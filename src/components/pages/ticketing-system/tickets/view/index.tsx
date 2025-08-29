"use client";
import React, { useState } from "react";
import UniBoxViewHeader from "./Header";
import MainContent from "./main";
import profileImg from "@/assets/images/profile/small-profile.png";
import profileImg2 from "@/assets/images/profile/small-profile2.svg";
import { useApiStore } from "@/lib/api/apiStore";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, CircularProgress } from "@mui/material";
export default function ViewUniBoxTicket({ ticketId }: any) {
  const { callApi, fetchUniboxTickets }: any = useApiStore();
  const [searchQuery, setSearchQuery] = useState("");
  // State to manage filter values
  const [filterValues, setFilterValues] = useState({
    status: "AllStatus",
    priority: "AllPriority",
    department: "AllDepartments",
    type: "AllTypes",
    assignee: "AllAssignees",
  });
  const {
    data: uniboxTickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["uniboxTickets", ticketId],
    queryFn: () => callApi(fetchUniboxTickets),
  });
  const activityData =
    (uniboxTickets &&
      uniboxTickets[1]?.activity_data?.map((ticket) => ({
        id: ticket.id,
        type: ticket.type,
        name: ticket.name,
        date: ticket.date,
        imageUrl: ticket.imageUrl,
      }))) ||
    [];
  const ticketData =
    (uniboxTickets &&
      uniboxTickets[0]?.ticket_data?.map((ticket) => ({
        ticketId: ticket.ticketId,
        Requester: ticket.Requester,
        Title: ticket.Title,
        Details: ticket.Details,
        Status: ticket.Status,
        Priority: ticket.Priority,
        Type: ticket.Type,
        Department: ticket.Department,
        Assignee: ticket.Assignee,
        Created: ticket.Created,
        LastReply: ticket.LastReply,
      }))) ||
    [];
  const conversationData =
    (uniboxTickets &&
      uniboxTickets[2]?.conversation_data?.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        message: ticket.message,
        date: ticket.date,
        imageUrl: ticket.imageUrl,
        attachment: ticket.attachment,
      }))) ||
    [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "var(--pri-color)" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  const filters = [
    {
      name: "priority",
      value: filterValues.priority,
      className: "priority-filter",
      filterOptions: [
        { value: "AllPriority", label: "All Priority" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: " Medium" },
        { value: "High", label: " High" },
        { value: "Urgent", label: "Urgent" },
      ],
    },
    {
      name: "department",
      value: filterValues.department,
      className: "department-filter",
      filterOptions: [
        { value: "AllDepartments", label: "All Departments" },
        { value: "Technical", label: "Technical" },
        { value: "Sales", label: "Sales" },
        { value: "Billing", label: "Billing" },
      ],
    },
  ];

  // Handle filter value changes
  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle apply filter button
  const handleApplyFilter = () => {
    console.log("Applying filters:", filterValues);
    // Add your filtering logic here (e.g., filter a table or make an API call)
  };
  const filteredTicketData = ticketData.filter((ticket) =>
    Object.values(ticket).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <UniBoxViewHeader
        filters={filters}
        onChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
      />
      <MainContent
        ticketId={ticketId}
        ticketData={filteredTicketData}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        activityData={activityData}
        conversationData={conversationData}
      />
    </div>
  );
}
