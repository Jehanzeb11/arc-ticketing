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
  const { callApi, fetchSingleTicket, fetchDepartments, getAllTickets }: any =
    useApiStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [update, SetUpdate] = useState(false);
  // State to manage filter values
  const [filterValues, setFilterValues] = useState({
    status: "All",
    priority: "All",
    department_id: "All",
  });

  const {
    data: allTickets,
    isLoading: allTicketsLoading,
    error: allTicketsError,
  } = useQuery({
    queryKey: [`uniboxTickets_${update}`],
    queryFn: () =>
      callApi(getAllTickets, {
        requestType: "getAllTickets",

        status: filterValues.status == "All" ? "" : filterValues.status,
        priority: filterValues.priority == "All" ? "" : filterValues.priority,
        department:
          filterValues.department_id == "All" ? "" : filterValues.department_id,
      }),
  });

  const {
    data: uniboxTickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ticketDetail", ticketId],
    queryFn: () =>
      callApi(fetchSingleTicket, {
        requestType: "ticketDetail",
        ticketId: JSON.parse(ticketId.value)?.id,
      }),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
  });

  console.log(ticketId, "ticketId");

  // const activityData =
  //   (uniboxTickets &&
  //     uniboxTickets?.map((ticket) => ({
  //       id: ticket.id,
  //       type: ticket.type,
  //       name: ticket.name,
  //       date: ticket.date,
  //       imageUrl: ticket.imageUrl,
  //     }))) ||
  //   [];
  // const ticketData =
  //   (uniboxTickets &&
  //     uniboxTickets?.map((ticket) => ({
  //       ticketId: ticket.ticketId,
  //       Requester: ticket.Requester,
  //       Title: ticket.Title,
  //       Details: ticket.Details,
  //       Status: ticket.Status,
  //       Priority: ticket.Priority,
  //       Type: ticket.Type,
  //       Department: ticket.Department,
  //       Assignee: ticket.Assignee,
  //       Created: ticket.Created,
  //       LastReply: ticket.LastReply,
  //     }))) ||
  //   [];
  // const conversationData =
  //   (uniboxTickets &&
  //     uniboxTickets?.map((ticket) => ({
  //       id: ticket.id,
  //       name: ticket.subject,
  //       email: ticket.email,
  //       message: ticket.message,
  //       date: ticket.date,
  //       imageUrl: ticket.imageUrl,
  //       attachment: ticket.attachment,
  //     }))) ||
  //   [];

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
      className: "table-dropdown-select",
      filterOptions: [
        { value: "All", label: "All Priority" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
      ],
      popperClassName: "ticket-table-dropdown",
    },
    {
      name: "status",
      value: filterValues.status,
      className: "department-filter",
      filterOptions: [
        { value: "All", label: "All Status" },
        { value: "Open", label: "Open" },
        { value: "In-Progress", label: "In-Progress" },
        { value: "Closed", label: "Closed" },
        { value: "Resolved", label: "Resolved" },
      ],
    },
    {
      name: "department_id",
      value: filterValues.department_id,
      className: "department-filter",
      filterOptions: [
        { value: "All", label: "All Departments" },
        ...(departments?.map((department: any) => ({
          value: department.id,
          label: department.name,
        })) || []),
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
    SetUpdate(!update);
  };
  // const filteredTicketData = ticketData.filter((ticket) =>
  //   Object.values(ticket).some((value) =>
  //     value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );
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
        ticketData={uniboxTickets}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        activityData={uniboxTickets}
        conversationData={uniboxTickets}
        allTickets={allTickets}
      />
    </div>
  );
}
