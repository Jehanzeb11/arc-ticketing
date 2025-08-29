"use client";
import React, { useState } from "react";
import TicketHeader from "./Header";
import ReusableTable from "@/components/common/Table/ReusableTable";
import unarchiveIcon from "@/assets/icons/unibox/ticket/listpage/unarchive.svg";
import { useRouter } from "next/navigation";
import MyModal from "@/components/common/Modal";
import { Box, Typography, Grid, Button } from "@mui/material";
import CustomButton from "@/components/common/Button/Button";
import archiveModalIcon from "@/assets/icons/unibox/ticket/listpage/archivemodal.svg";
import DashboardHeader from "../../DashboardHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import Image from "next/image";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";

export default function ArchiveTicketsPage() {
  const {
    callApi,
    fetchUniboxTickets,
    updateUniboxTicket,
    fetchDepartments,
    fetchUsers,
  } = useApiStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [unarchiveModal, setUnarchiveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({
    department: "AllDepartments",
    type: "AllTypes",
    assignee: "AllAssignees",
    priority: "AllPriority",
    status: "AllStatus",
  });

  // Fetch tickets
  const { data: uniboxTickets, isLoading } = useQuery({
    queryKey: ["uniboxTickets"],
    queryFn: () => callApi(fetchUniboxTickets),
  });

  // Fetch departments and users for filters
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => callApi(fetchDepartments),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => callApi(fetchUsers),
  });

  // Unarchive mutation
  const unarchiveTicketMutation = useMutation({
    mutationFn: (ticketId: string) => {
      const ticketData = uniboxTickets?.[0]?.ticket_data?.find(
        (t: any) => t.ticketId === ticketId
      );
      if (!ticketData) throw new Error("Ticket not found");

      const updatedTicket = { ...ticketData, archived: false };
      return callApi(updateUniboxTicket, ticketId, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTickets"] });
      setUnarchiveModal(false);
      setSelectedTicket(null);
    },
  });

  const columns = [
    { key: "ticketId", title: "ID", filterable: false },
    { key: "Requester", title: "Requester", filterable: false },
    { key: "Title", title: "Title", filterable: false },
    { key: "Details", title: "Details", filterable: false },
    { key: "Status", title: "Status", filterable: false },
    { key: "Priority", title: "Priority", filterable: false },
    { key: "Type", title: "Type", filterable: false },
    { key: "Department", title: "Department", filterable: false },
    { key: "Assignee", title: "Assignee", filterable: false },
    { key: "Created", title: "Created", filterable: false },
    { key: "LastReply", title: "Last Reply", filterable: false },
  ];

  // Filter archived tickets only
  const archivedTickets =
    uniboxTickets?.[0]?.ticket_data?.filter(
      (ticket: any) => ticket.archived === true
    ) || [];

  const data = archivedTickets.map((ticket: any) => ({
    ticketId: ticket.ticketId || "N/A",
    Requester: ticket.Requester || "N/A",
    Title: ticket.Title || "N/A",
    Details: ticket.Details || "N/A",
    Status: ticket.Status || "N/A",
    Priority: ticket.Priority || "N/A",
    Type: ticket.Type || "N/A",
    Department: ticket.Department || "N/A",
    Assignee: ticket.Assignee || "N/A",
    Created: ticket.Created || "N/A",
    LastReply: ticket.LastReply || "N/A",
  }));

  const actions = [
    {
      icon: unarchiveIcon,
      className: "action-icon",
      onClick: (row: any) => {
        setSelectedTicket(row);
        setUnarchiveModal(true);
      },
      tooltip: "Unarchive Ticket",
    },
  ];

  const filters = [
    {
      name: "status",
      value: filterValues.status,
      className: "status-filter",
      filterOptions: [
        { value: "AllStatus", label: "All Status" },
        { value: "Open", label: "Open" },
        { value: "In-progress", label: "In-progress" },
        { value: "Resolved", label: "Resolved" },
        { value: "Closed", label: "Closed" },
      ],
    },
    {
      name: "priority",
      value: filterValues.priority,
      className: "priority-filter",
      filterOptions: [
        { value: "AllPriority", label: "All Priority" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
        { value: "Urgent", label: "Urgent" },
      ],
    },
    {
      name: "department",
      value: filterValues.department,
      className: "department-filter",
      filterOptions: [
        { value: "AllDepartments", label: "All Departments" },
        ...(departments?.map((dept: any) => ({
          value: dept.name,
          label: dept.name,
        })) || []),
      ],
    },
    {
      name: "type",
      value: filterValues.type,
      className: "type-filter",
      filterOptions: [
        { value: "AllTypes", label: "All Types" },
        { value: "Support", label: "Support" },
        { value: "Feature", label: "Feature" },
        { value: "Bug", label: "Bug" },
        { value: "Question", label: "Question" },
      ],
    },
    {
      name: "assignee",
      value: filterValues.assignee,
      className: "assignee-filter",
      filterOptions: [
        { value: "AllAssignees", label: "All Assignees" },
        ...(users?.map((user: any) => ({
          value: user.user_name,
          label: user.user_name,
          icon: AssigneeIcon,
        })) || []),
      ],
    },
  ];

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilter = () => {
    setFilterValues({
      status: "AllStatus",
      priority: "AllPriority",
      department: "AllDepartments",
      type: "AllTypes",
      assignee: "AllAssignees",
    });
    setSearchQuery("");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value?.toString() || "");
  };

  const handleUnarchive = () => {
    if (selectedTicket?.ticketId) {
      unarchiveTicketMutation.mutate(selectedTicket.ticketId);
    }
  };

  // Apply filters to data
  const filteredData = data.filter((ticket) => {
    const matchesSearch = Object.values(ticket).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesStatus =
      filterValues.status === "AllStatus" ||
      ticket.Status === filterValues.status;
    const matchesPriority =
      filterValues.priority === "AllPriority" ||
      ticket.Priority === filterValues.priority;
    const matchesDepartment =
      filterValues.department === "AllDepartments" ||
      ticket.Department === filterValues.department;
    const matchesType =
      filterValues.type === "AllTypes" || ticket.Type === filterValues.type;
    const matchesAssignee =
      filterValues.assignee === "AllAssignees" ||
      ticket.Assignee === filterValues.assignee;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesDepartment &&
      matchesType &&
      matchesAssignee
    );
  });

  return (
    <div>
      <DashboardHeader
        title="Archived Tickets"
        text="Manage archived customer support tickets"
      />
      <TicketHeader
        archive={true}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Filters */}
      <Grid
        container
        sx={{
          alignItems: "center",
          background: "#fff",
          p: 1.5,
          mb: 2,
          borderRadius: 3,
        }}
        spacing={2}
      >
        {filters.map((filter: any, index: number) => (
          <Grid size={{ lg: 1.4, xs: 12 }} key={index}>
            <TableSelectFilterMainNew
              value={filter.value || ""}
              name={filter.name}
              options={filter.filterOptions}
              popperClassName={filter.className}
              defaultText="All"
              className="table-dropdown-select"
              onChange={handleFilterChange}
            />
          </Grid>
        ))}
        <Grid size={{ lg: 3, xs: 12 }}>
          <Box sx={{ display: "flex", gap: "10px" }} className="ticket-button">
            <CustomButton text="Reset Filter" onClick={handleResetFilter} />
            <Button className="reset-button" onClick={handleResetFilter}>
              <Image src={resetIcon} alt="reset-icon" />
              Reset Filter
            </Button>
          </Box>
        </Grid>
      </Grid>

      <div className="table-parent unibox-table">
        <ReusableTable
          columns={columns}
          data={filteredData}
          actions={actions}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={false}
          enableRowSelection={false}
          pageSize={10}
          isLoading={isLoading}
        />
      </div>

      {/* Unarchive Modal */}
      <MyModal
        open={unarchiveModal}
        setOpen={setUnarchiveModal}
        customStyle="archive-modal"
      >
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center", mb: 2 }}>
          <Image src={archiveModalIcon} alt="unarchive-modal-icon" width={50} />
          <Typography variant="h6">Unarchive Ticket</Typography>
        </Box>
        <Typography variant="body1" sx={{ fontSize: "20px", mb: 1 }}>
          Are you sure you want to unarchive ticket {selectedTicket?.ticketId}?
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "15px", mb: 2 }}>
          This will move the ticket back to active tickets.
        </Typography>
        <Box sx={{ display: "flex", gap: "15px" }} className="ticket-button">
          <CustomButton
            text="Cancel"
            btntrasnparent={true}
            onClick={() => setUnarchiveModal(false)}
          />
          <CustomButton text="Unarchive" onClick={handleUnarchive} />
        </Box>
      </MyModal>
    </div>
  );
}
