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
import unarchiveIcon from "@/assets/icons/unibox/ticket/listpage/new-archive.png";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";
import deleteIcon from "@/assets/icons/new-delete.png";
import deleteModalDeleteIcon from "@/assets/icons/users/delete-icon-2.png";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon2.svg";

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
  const [deleteModal, setDeleteModal] = useState(false);
  const [update, SetUpdate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [archivedTickets, setArchivedTickets] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterValues, setFilterValues] = useState({
    department_id: "All",
    type: "All",
    assignee: "All",
    priority: "All",
    status: "All",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: uniboxTickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`uniboxTicketsArchive_${update}`],
    queryFn: () =>
      callApi(getAllTickets, {
        requestType: `getTicketList`,
        apitype: "archive",
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
      queryClient.invalidateQueries({ queryKey: ["uniboxTicketsArchive"] });
      setArchiveModal(false);
      toast.success("Ticket updated successfully!");
      SetUpdate(!update);
    },
    onError: (error) => {
      console.error("Failed to update ticket:", error);
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: ({ ticketId, action, user }: any) => {
      console.log(ticketId, "ticketId");

      const ticketData = uniboxTickets?.find((t: any) => t.id === ticketId);
      if (!ticketData) throw new Error("Ticket not found");

      const updatedTicket = {
        requestType: "deleteOrRestoreTicket",
        id: ticketId,
        action: action,
        user: user,
      };
      return callApi(updateUniboxTicket, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTicketsArchive"] });
      setArchiveModal(false);
      toast.success("Ticket updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update ticket:", error);
    },
  });

  console.log(uniboxTickets, "uniboxTicketsArchive");

  const archiveTicketMutation = useMutation({
    mutationFn: ({ ticketId, archived }: any) => {
      const ticketData = uniboxTickets?.find((t: any) => t.id === ticketId);
      if (!ticketData) throw new Error("Ticket not found");

      const updatedTicket = { ...ticketData, archived };
      return callApi(updateUniboxTicket, ticketId, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTicketsArchive"] });
      setArchiveModal(false);
      SetUpdate(!update);
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
  const handleFieldDelete = (ticketId: string, value: any) => {
    deleteTicketMutation.mutate({ ticketId, action: "delete", user: value });
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
              options={[
                { value: "Open", label: "Open" },
                { value: "In-progress", label: "In-progress" },
                { value: "Resolved", label: "Resolved" },
                { value: "Closed", label: "Closed" },
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
              popperClassName="ticket-table-dropdown"
              value={ticket.priority || "Low"}
              name="Priority"
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Urgent", label: "Urgent" },
              ]}
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "priority", e.target.value)
              }
              className="table-dropdown-select"
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
              options={[
                { value: "Support", label: "Support" },
                { value: "Feature", label: "Feature" },
                { value: "Bug", label: "Bug" },
                { value: "Question", label: "Question" },
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
              value={ticket.Department || "Technical"}
              name="Department"
              options={
                departments?.map((dept: any) => ({
                  value: dept.name,
                  label: dept.name,
                })) || []
              }
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "Department", e.target.id)
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
              value={ticket.Assignee || "Unassigned"}
              name="Assignee"
              options={
                users?.map((user: any) => ({
                  value: user.user_id,
                  label: user.full_name,
                  icon: AssigneeIcon,
                })) || []
              }
              onChange={(e: any) =>
                handleFieldUpdate(ticket.id, "assignee", e.target.value)
              }
              className="table-dropdown-select"
            />
          </div>
        ),
        Created: ticket.Created || "N/A",
        LastReply: ticket.LastReply || "N/A",
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
    {
      className: "action-icon",
      icon2: (row: any) => {
        return archivedTickets.includes(row.id) ? unarchiveIcon : unarchiveIcon;
      },
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
    {
      className: "action-icon",
      icon: deleteIcon,
      onClick: (row: any) => {
        if (row && row.id) {
          setSelectedTicket(row);
          setDeleteModal(true);
        } else {
          console.error("Invalid row or missing id:", row);
        }
      },
      tooltip: "Delete Ticket",
    },
  ];

  const handleRowClick = (row: any) => {
    router.push(`/tickets/${row.id}`);
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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log("Selected Date:", date);
  };

  const handleResetFilter = () => {
    setFilterValues({
      status: "All",
      priority: "All",
      department_id: "All",
      type: "All",
      assignee: "All",
    });
    setSelectedDate([null, null]);
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
              sx={{ border: "1px solid #DBDBDB", borderRadius: "30px" }}
            />
          </Grid>
        ))}
        <ReuseableDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          className={styles.customDatePicker}
          minDate={new Date(2023, 0, 1)}
          maxDate={new Date(2025, 11, 31)}
          locale="en-US"
          format="dd/MM/yyyy"
        />
        <Grid size={{ lg: 3, xs: 12 }}>
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
      </Grid>

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
        <CreateTicket closeModal={() => setAddModal(false)} />
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
                ? "Archive"
                : "Un Archive"
            }
            onClick={() =>
              handleFieldUpdate(selectedTicket?.id, "is_archive", false)
            }
          />
        </Box>
      </MyModal>

      <MyModal
        open={deleteModal}
        setOpen={setDeleteModal}
        customStyle="archive-modal"
      >
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center", mb: 2 }}>
          <Image src={DeleteModalIcon} alt="delete-modal-icon" width={50} />
          <Typography variant="h6">Confirm Deletion</Typography>
        </Box>
        <Typography mb={2}>
          Are you sure you want to permanently delete {selectedTicket?.ticketId}
          ? This action cannot be undone.
        </Typography>
        <Box sx={{ display: "flex", gap: "15px" }} className="ticket-button">
          <CustomButton
            type="button"
            text="Cancel"
            style={{ padding: "10px 36px", width: "unset" }}
            btntrasnparent={true}
            onClick={() => {
              setDeleteModal(false);
            }}
          />
          <CustomButton
            btnDelete={true}
            text="Delete"
            icon={deleteModalDeleteIcon}
            style={{ padding: "10px 36px", width: "unset" }}
            onClick={() => {
              handleFieldDelete(selectedTicket?.id, 1);
            }}
          />
        </Box>
      </MyModal>
    </div>
  );
}
