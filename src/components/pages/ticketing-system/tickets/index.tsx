"use client";

// React and Next.js imports
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Material-UI imports
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

// Component imports
import TicketHeader from "./Header";
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import CustomButton from "@/components/common/Button/Button";
import CreateTicket from "@/components/common/Form/ticket/CreateTicket";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";

// Asset imports
import archiveIcon from "@/assets/icons/unibox/ticket/listpage/archive2.svg";
import archiveModalIcon2 from "@/assets/icons/unibox/ticket/listpage/archive-icon-2.png";
import createModalIcon from "@/assets/icons/unibox/ticket/create-modal.svg";
import unarchiveIcon from "@/assets/icons/unibox/ticket/listpage/unarchive.svg";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";

// Store and Query imports
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import Image from "next/image";
import ReuseableDatePicker from "@/components/common/react-day-date-picker/ReuseableDatePicker";
import styles from "@/components/style/ReuseableDatePicker.module.css";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import DashboardHeader from "../../DashboardHeader";
import TicketsCards from "./TicketsCards";
import toast from "react-hot-toast";
import { usePermission } from "@/hooks/usePermission";

export default function UniBoxTickets() {
  const {
    callApi,
    fetchUniboxTickets,
    updateUniboxTicket,
    fetchDepartments,
    fetchUsers,
    getAllTickets,
  }: any = useApiStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addModal, setAddModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [update, SetUpdate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [archivedTickets, setArchivedTickets] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [filterValues, setFilterValues] = useState({
    department_id: "All",
    type: "All",
    assignee: "All",
    priority: "All",
    status: "All",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const canFilterTickets = usePermission("Search & Filter Tickets");
  const canArchiveTickets = usePermission("Archive Tickets");
  const editTicketFields = usePermission("Edit Ticket Fields");
  const canViewTicket = usePermission("View Tickets");

  const {
    data: ticketKpiStats,
    isLoading: ticketKpiStatsLoading,
    error: ticketKpiStatsError,
  } = useQuery({
    queryKey: ["ticketKpi"],
    queryFn: () => callApi(getAllTickets, { requestType: "ticketKpiStats" }),
  });
  const {
    data: uniboxTickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`uniboxTickets_${update}`],
    queryFn: () =>
      callApi(getAllTickets, {
        requestType: "getAllTickets",
        type: filterValues.type == "All" ? "" : filterValues.type,
        status: filterValues.status == "All" ? "" : filterValues.status,
        priority: filterValues.priority == "All" ? "" : filterValues.priority,
        department:
          filterValues.department_id == "All" ? "" : filterValues.department_id,
        assignee: filterValues.assignee == "All" ? "" : filterValues.assignee,
        startDate: selectedDate?.[0]
          ? selectedDate[0].toISOString().split("T")[0]
          : "",
        endDate: selectedDate?.[1]
          ? selectedDate[1].toISOString().split("T")[0]
          : "",
      }),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      callApi(fetchUsers, {
        requestType: "getAllUsers",
      }),
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ ticketId, field, value }: any) => {
      console.log(ticketId, "ticketId");

      const ticketData = uniboxTickets?.find((t: any) => t.id === ticketId);
      if (!ticketData) throw new Error("Ticket not found");

      const updatedTicket = {
        requestType: "updateTicketField",
        id: ticketId,
        field: field,
        value: value,
      };
      return callApi(updateUniboxTicket, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTickets"] });
      setArchiveModal(false);
      toast.success("Ticket updated successfully!");
      SetUpdate(!update);
    },
    onError: (error) => {
      console.error("Failed to update ticket:", error);
    },
  });

  console.log(uniboxTickets, "uniboxTickets");

  const archiveTicketMutation = useMutation({
    mutationFn: ({ ticketId, archived }: any) => {
      const ticketData = uniboxTickets?.find((t: any) => t.id === ticketId);
      if (!ticketData) throw new Error("Ticket not found");

      const updatedTicket = { ...ticketData, archived };
      return callApi(updateUniboxTicket, ticketId, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTickets"] });
      setArchiveModal(false);
      setSelectedTicket(null);
    },
    onError: (error) => {
      console.error("Failed to archive ticket:", error);
    },
  });

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

  const handleFieldUpdate = (ticketId: string, field: string, value: any) => {
    updateTicketMutation.mutate({ ticketId, field, value });
  };

  const sx = {
    width: "120px",
    "& .MuiAutocomplete-inputRoot ": {
      borderRadius: "30px !important",
    },
    "& .MuiInputBase-input": {
      padding: "5px !important",
      fontSize: "12px !important",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "13px !important",
    },
  };

  //  const canFilterTicket = usePermission("Search & Filter Tickets")

  const data =
    (uniboxTickets &&
      uniboxTickets?.map((ticket: any) => ({
        id: ticket.id,
        ticketId: ticket.ticket_reference || "N/A",
        Requester: ticket.customer_name || "N/A",
        Title: ticket.subject.slice(0, 15) + "..." || "N/A",
        Details: ticket.details || "N/A",
        Status: (
          <div onClick={(e) => e.stopPropagation()}>
            <TableSelectFilterMainNew
              sx={sx}
              popperClassName="ticket-table-dropdown"
              value={ticket.status || "Open"}
              name="Status"
              options={editTicketFields ? [
                { value: "Open", label: "Open" },
                { value: "In-progress", label: "In-progress" },
                { value: "Resolved", label: "Resolved" },
                { value: "Closed", label: "Closed" },
              ] : [
                { value: ticket.status, label: ticket.status || "Open" },
              ]}
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "status", e.target.value)
              }
              className="table-dropdown-select"
            />
          </div>
        ),
        Priority: (
          <div onClick={(e) => e.stopPropagation()}>
            <TableSelectFilterMainNew
              sx={sx}
              popperClassName="ticket-table-dropdown priority-table-dropdown"
              value={ticket.priority || "Low"}
              name="Priority"
              options={editTicketFields ? [
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Urgent", label: "Urgent" },
              ] : [
                { value: ticket.priority, label: ticket.priority || "Low" },
              ]}
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "priority", e.target.value)
              }
              className="table-dropdown-select priority-table-dropdown"
            />
          </div>
        ),
        Type: (
          <div onClick={(e) => e.stopPropagation()}>
            <TableSelectFilterMainNew
              sx={sx}
              popperClassName="ticket-table-dropdown"
              value={ticket.type || "Support"}
              name="Type"
              options={editTicketFields ? [
                { value: "Support", label: "Support" },
                { value: "Feature", label: "Feature" },
                { value: "Bug", label: "Bug" },
                { value: "Question", label: "Question" },
              ] : [
                { value: ticket.type, label: ticket.type || "Support" },
              ]}
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "type", e.target.value)
              }
              className="table-dropdown-select"
            />
          </div>
        ),
        Department: (
          <div onClick={(e) => e.stopPropagation()}>
            <TableSelectFilterMainNew
              sx={sx}
              popperClassName="ticket-table-dropdown"
              value={ticket.department_id || "Technical"}
              name="Department"
              options={editTicketFields ? (departments?.map((dept: any) => ({
                value: dept.id,
                label: dept.name,
              })) || []) : [
                { value: ticket.department_id, label: ticket.department_name || "N/A" },
              ]
              }
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "department_id", e.target.value)
              }
              className="table-dropdown-select"
            />
          </div>
        ),
        Assignee: (
          <div onClick={(e) => e.stopPropagation()}>
            <TableSelectFilterMainNew
              sx={sx}
              popperClassName="ticket-table-dropdown"
              value={ticket.assignee || "Unassigned"}
              name="Assignee"
              options={editTicketFields ?
                users?.map((user: any) => ({
                  value: user.user_id,
                  label: user.full_name,
                  icon: AssigneeIcon,
                })) || [] : [
                  { value: ticket.assignee, label: ticket.assignee || "Unassigned" },
                ]}
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "assignee", e.target.value)
              }
              className="table-dropdown-select"
            />
          </div>
        ),
        Created: ticket.created_at.split("T")[0] || "N/A",
        LastReply: ticket.replies[0] || "N/A",
      }))) ||
    [];

  const handleArchiveTicket = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedTicket && selectedTicket.ticketId) {
      const isArchived = archivedTickets.includes(selectedTicket.ticketId);
      archiveTicketMutation.mutate({
        ticketId: selectedTicket.ticketId,
        archived: !isArchived,
      });
    }
  };


  const actions = [
    canArchiveTickets && {
      className: "action-icon",
      icon2: (row: any) =>
        archivedTickets.includes(row.id) ? unarchiveIcon : archiveIcon,
      onClick: (row: any) => {
        if (row && row.id) {
          setSelectedTicket(row);
          setArchiveModal(true);
        } else {
          console.error("Invalid row or missing id:", row);
        }
      },
      tooltip: (row: any) =>
        archivedTickets.includes(row.id)
          ? "Unarchive Ticket"
          : "Archive Ticket",
    },
  ].filter(Boolean); // ✅ removes false when permission is missing


  const handleRowClick = (row: any) => {
   canViewTicket && router.push(`/ticketing-system/tickets/${row.id}`);
    setSelectedTicket(row);
  };

  const filters = [
    {
      name: "status",
      value: filterValues.status,
      className: "status-filter",
      filterOptions: [
        { value: "All", label: "All Status" },
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
        { value: "All", label: "All Priority" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: " Medium" },
        { value: "High", label: " High" },
        { value: "Urgent", label: "Urgent" },
      ],
    },
    {
      name: "department_id",
      value: filterValues.department_id,
      className: "department-filter",
      filterOptions: [
        { value: "All", label: "All Departments" },
        ...(departments?.map((dept: any) => ({
          value: dept.id,
          label: dept.name,
        })) || []),
      ],
    },
    {
      name: "type",
      value: filterValues.type,
      className: "type-filter",
      filterOptions: [
        { value: "All", label: "All Types" },
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
        { value: "All", label: "All Assignees" },
        ...(users?.map((user: any) => ({
          value: user.user_id,
          label: user.full_name,
          icon: AssigneeIcon,
        })) || []),
      ],
    },
  ];

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    SetUpdate(!update);
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    // setSelectedDate(range);
    console.log("Selected range:", range);
  };

  const handleResetFilter = () => {
    setFilterValues({
      status: "",
      priority: "",
      department_id: "",
      type: "",
      assignee: "",
    });
    SetUpdate(!update);
  };

  const filteredTicketData = data.filter((ticket) =>
    Object.values(ticket).some((value) =>
      value
        ?.toString()
        .toLowerCase()
        .includes(searchQuery?.toString().toLowerCase() || "")
    )
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value?.toString() || "");
  };

  console.log(selectedDate);

  return (
    <div>
      <DashboardHeader
        title="Tickets"
        text="Manege customer support tickets with real-time KPIs"
      />
      <TicketsCards ticketKpiStats={ticketKpiStats} />
      <TicketHeader
        onClickAddTicket={() => setAddModal(true)}
        onClickArchive={() => router.push("/ticketing-system/tickets/archive")}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      {canFilterTickets && <Grid
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
          <Grid size={{ lg: 1.55, xs: 12 }} key={index}>
            <TableSelectFilterMainNew
              value={filter.value || ""}
              name={filter.name}
              options={filter.filterOptions}
              popperClassName={filter.className}
              defaultText="All"
              className="table-dropdown-select"
              onChange={handleFilterChange}
              sx={{ border: "1px solid #DBDBDB", borderRadius: "30px" }}
            />
          </Grid>
        ))}
        <ReuseableDatePicker
          value={selectedDate}
          onChange={(range) => {
            console.log("Final range:", range);
            setSelectedDate(range);
          }}
          minDate={new Date(2023, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
        />

        <Grid size={{ lg: 2.5, xs: 12 }}>
          <Box sx={{ display: "flex", gap: "10px" }} className="ticket-button">
            <CustomButton
              customClass={"btn-outlined"}
              text="Apply filter"
              onClick={handleApplyFilter}
            />
            <Button className="reset-button" onClick={handleResetFilter}>
              <Image src={resetIcon} alt="reset-icon" />
              Reset Filter
            </Button>
          </Box>
        </Grid>
      </Grid>}

      <div className="table-parent unibox-table">
        <ReusableTable
          maxContentWidth="max-content !important"
          columns={columns}
          data={filteredTicketData}
          actions={actions}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={true}
          enableRowSelection={false}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </div>

      <MyModal
        open={addModal}
        setOpen={setAddModal}
        customStyle="create-ticket-modal"
        modalHeader="true"
        modalTitle="Create Ticket"
        iconSrc={createModalIcon}
      >
        <CreateTicket
          closeModal={() => setAddModal(false)}
          getall={() =>
            queryClient.invalidateQueries({
              queryKey: [`uniboxTickets_${update}`],
            })
          }
        />
      </MyModal>

      <MyModal
        open={archiveModal}
        setOpen={setArchiveModal}
        customStyle="archive-modal"
      >
        <Box>
          <Box
            sx={{ display: "flex", gap: "15px", alignItems: "center", mb: 2 }}
          >
            <Image
              src={archiveModalIcon2}
              alt="archive-modal-icon"
              width={50}
            />
            <Typography variant="h6">Archive Ticket</Typography>
          </Box>
          <Typography variant="body1" sx={{ fontSize: "20px", mb: 1 }}>
            Are you sure want to archive ticket {selectedTicket?.ticketId}?
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "15px", mb: 2 }}>
            This action cannot be revert
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "15px" }} className="ticket-button">
          <CustomButton
            style={{ padding: "10px 36px", width: "unset" }}
            text="Cancel"
            btntrasnparent
            onClick={() => setArchiveModal(false)}
          />
          <CustomButton
            style={{ padding: "10px 36px", width: "unset" }}
            text={
              archivedTickets.includes(selectedTicket?.id)
                ? "Unarchive"
                : "Archive"
            }
            onClick={() =>
              handleFieldUpdate(selectedTicket?.id, "is_archive", true)
            }
          />
        </Box>
      </MyModal>
    </div>
  );
}
