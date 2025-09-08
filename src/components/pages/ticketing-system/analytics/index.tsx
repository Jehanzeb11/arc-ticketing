"use client";
import React, { useState } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import { Box, Button, Grid, Typography } from "@mui/material";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import Image from "next/image";
import CustomButton from "@/components/common/Button/Button";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import totalTicketIcon from "@/assets/icons/analytics/total-tickets-icon.svg";
import ticketsResolvedIcon from "@/assets/icons/analytics/tickets-resolved-icons.svg";
import ticketsOpenIcon from "@/assets/icons/analytics/tickets-open-icon.svg";
import avgResponseTimeIcon from "@/assets/icons/analytics/avg-response-time-icon.svg";
import ReusableTable from "@/components/common/Table/ReusableTable";
import AnalyticsProgressBarCard from "./AnalyticsProgressBarCard";

function Analytics() {
  const [filterValues, setFilterValues] = useState({
    timeRange: "ThisMonth",
    department: "AllDepartments",
    type: "AllTypes",
    priority: "AllPriorities",
    assignee: "AllAssignees",
    breakdown: "NoBreakdown",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    {
      name: "timeRange",
      value: filterValues.timeRange,
      className: "timeRange-filter",
      filterOptions: [
        { value: "ThisMonth", label: "This Month" },
        { value: "LastMonth", label: "Last Month" },
        { value: "ThisQuarter", label: "This Quarter" },
        { value: "ThisYear", label: "This Year" },
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
      name: "priority",
      value: filterValues.priority,
      className: "priority-filter",
      filterOptions: [
        { value: "AllPriorities", label: "All Priorities" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
        { value: "Urgent", label: "Urgent" },
      ],
    },
    {
      name: "assignee",
      value: filterValues.assignee,
      className: "assignee-filter",
      filterOptions: [
        { value: "AllAssignees", label: "All Assignees" },
        { value: "SarahWilson", label: "Sarah Wilson", icon: AssigneeIcon },
        { value: "JansonRoe", label: "Janson Roe", icon: AssigneeIcon },
        { value: "JohnDoe", label: "John Doe", icon: AssigneeIcon },
      ],
    },
    {
      name: "breakdown",
      value: filterValues.breakdown,
      className: "breakdown-filter",
      filterOptions: [
        { value: "NoBreakdown", label: "No Breakdown" },
        { value: "ByAgent", label: "By Agent" },
        { value: "ByDepartment", label: "By Department" },
        { value: "ByType", label: "By Type" },
      ],
    },
  ];

  const columns = [
    { key: "agentName", title: "Agent Name", filterable: false },
    { key: "assigned", title: "Assigned", filterable: false },
    { key: "resolved", title: "Resolved", filterable: false },
    { key: "resolution_rate", title: "Resolution rate (%)", filterable: false },
    { key: "avg_response_time", title: "Avg Response Time", filterable: false },
    {
      key: "avg_resolution_time",
      title: "Avg Resolution Time",
      filterable: false,
    },
    { key: "open", title: "Open", filterable: false },
    { key: "in_progress", title: "In progress", filterable: false },
    { key: "closed", title: "Closed", filterable: false },
    { key: "csat", title: "CSAT (%)", filterable: false },
  ];

  // Hardcoded dummy data aligned with columns
  const data = [
    {
      agentName: "Sarah Wilson",
      assigned: 10,
      resolved: 7,
      resolution_rate: 70,
      avg_response_time: "25 min",
      avg_resolution_time: "2 hr",
      open: 2,
      in_progress: 1,
      closed: 7,
      csat: 85,
      department: "Technical",
      type: "Bug",
      priority: "High",
    },
    {
      agentName: "Janson Roe",
      assigned: 8,
      resolved: 5,
      resolution_rate: 62.5,
      avg_response_time: "30 min",
      avg_resolution_time: "3 hr",
      open: 2,
      in_progress: 1,
      closed: 5,
      csat: 90,
      department: "Technical",
      type: "Feature",
      priority: "Medium",
    },
    {
      agentName: "John Doe",
      assigned: 12,
      resolved: 10,
      resolution_rate: 83.3,
      avg_response_time: "20 min",
      avg_resolution_time: "1.5 hr",
      open: 1,
      in_progress: 1,
      closed: 10,
      csat: 95,
      department: "Billing",
      type: "Question",
      priority: "Urgent",
    },
    {
      agentName: "Alice Smith",
      assigned: 6,
      resolved: 3,
      resolution_rate: 50,
      avg_response_time: "40 min",
      avg_resolution_time: "4 hr",
      open: 2,
      in_progress: 1,
      closed: 3,
      csat: 80,
      department: "Sales",
      type: "Question",
      priority: "Low",
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
    console.log("Applying filters:", filterValues);
  };

  const handleResetFilter = () => {
    setFilterValues({
      timeRange: "ThisMonth",
      department: "AllDepartments",
      type: "AllTypes",
      priority: "AllPriorities",
      assignee: "AllAssignees",
      breakdown: "NoBreakdown",
    });
  };

  const filteredTicketData = data.filter(
    (agent) =>
      (filterValues.department === "AllDepartments" ||
        agent.department === filterValues.department) &&
      (filterValues.type === "AllTypes" || agent.type === filterValues.type) &&
      (filterValues.priority === "AllPriorities" ||
        agent.priority === filterValues.priority) &&
      (filterValues.assignee === "AllAssignees" ||
        agent.agentName === filterValues.assignee) &&
      Object.values(agent).some((value) =>
        value
          ?.toString()
          .toLowerCase()
          .includes(searchQuery?.toString().toLowerCase() || "")
      )
  );

  // Calculate metrics for the cards based on filteredTicketData
  const totalTickets = filteredTicketData.reduce(
    (sum, agent) => sum + agent.assigned,
    0
  );
  const ticketsResolved = filteredTicketData.reduce(
    (sum, agent) => sum + agent.resolved,
    0
  );
  const ticketsOpen = filteredTicketData.reduce(
    (sum, agent) => sum + agent.open + agent.in_progress,
    0
  );
  // Calculate average response time in minutes
  const avgResponseTime =
    filteredTicketData.length > 0
      ? (() => {
          const totalMinutes = filteredTicketData.reduce((sum, agent) => {
            const time = agent.avg_response_time.match(/(\d+)\s*min/); // Extract minutes from "XX min"
            return sum + (time ? parseInt(time[1]) : 0);
          }, 0);
          const avgMinutes = Math.round(
            totalMinutes / filteredTicketData.length
          );
          return `${avgMinutes} min`;
        })()
      : "0 min";

  return (
    <div className="main-analytics">
      <AnalyticsHeader />
      <Grid
        container
        sx={{
          alignItems: "center",
          background: "#fff",
          p: 1.5,
          my: "20px",
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
        <Grid size={{ lg: 3, xs: 12 }}>
          <Box sx={{ display: "flex", gap: "10px" }} className="ticket-button">
            <CustomButton
              text="Apply filter"
              customClass={"btn-outlined"}
              onClick={handleApplyFilter}
            />
            <Button className="reset-button" onClick={handleResetFilter}>
              <Image src={resetIcon} alt="reset-icon" />
              Reset Filter
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ lg: 12, xs: 12 }} container spacing={2} sx={{ mb: "20px" }}>
        <Grid
          size={{ lg: 3, xs: 12 }}
          sx={{
            padding: "20px 15px 20px 40px",
            background: "#fff",
            borderRadius: "17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              color="initial"
              sx={{
                color: "#3E3E3E",
                fontSize: "20.64px",
                fontWeight: 700,
                lineHeight: "normal",
                mt: "10px",
              }}
            >
              Total Tickets
            </Typography>
            <Image src={totalTicketIcon} alt="total-ticket" />
          </Box>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#3D3D3D",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            {totalTickets}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000050",
              fontSize: "15.247px",
              fontWeight: 500,
              lineHeight: "125.5%",
              letterSpacing: "0.305px",
            }}
          >
            All tickets in selected range
          </Typography>
        </Grid>
        <Grid
          size={{ lg: 3, xs: 12 }}
          sx={{
            padding: "20px 15px 20px 40px",
            background: "#fff",
            borderRadius: "17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              color="initial"
              sx={{
                color: "#3E3E3E",
                fontSize: "20.64px",
                fontWeight: 700,
                lineHeight: "normal",
                mt: "10px",
              }}
            >
              Tickets Resolved
            </Typography>
            <Image src={ticketsResolvedIcon} alt="total-ticket" />
          </Box>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#3D3D3D",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            {ticketsResolved}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000050",
              fontSize: "15.247px",
              fontWeight: 500,
              lineHeight: "125.5%",
              letterSpacing: "0.305px",
            }}
          >
            Tickets closed or resolved
          </Typography>
        </Grid>
        <Grid
          size={{ lg: 3, xs: 12 }}
          sx={{
            padding: "20px 15px 20px 40px",
            background: "#fff",
            borderRadius: "17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              color="initial"
              sx={{
                color: "#3E3E3E",
                fontSize: "20.64px",
                fontWeight: 700,
                lineHeight: "normal",
                mt: "10px",
              }}
            >
              Tickets Open
            </Typography>
            <Image src={ticketsOpenIcon} alt="total-ticket" />
          </Box>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#3D3D3D",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            {ticketsOpen}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000050",
              fontSize: "15.247px",
              fontWeight: 500,
              lineHeight: "125.5%",
              letterSpacing: "0.305px",
            }}
          >
            Currently active tickets
          </Typography>
        </Grid>
        <Grid
          size={{ lg: 3, xs: 12 }}
          sx={{
            padding: "20px 15px 20px 40px",
            background: "#fff",
            borderRadius: "17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              color="initial"
              sx={{
                color: "#3E3E3E",
                fontSize: "20.64px",
                fontWeight: 700,
                lineHeight: "normal",
                mt: "10px",
              }}
            >
              Avg Response Time
            </Typography>
            <Image src={avgResponseTimeIcon} alt="total-ticket" />
          </Box>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#3D3D3D",
              fontSize: "30px",
              fontWeight: 500,
            }}
          >
            {avgResponseTime}
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000050",
              fontSize: "15.247px",
              fontWeight: 500,
              lineHeight: "125.5%",
              letterSpacing: "0.305px",
            }}
          >
            From creation to last reply
          </Typography>
        </Grid>
      </Grid>
      <div className="table-parent">
        <Typography
          variant="body1"
          color="initial"
          sx={{
            color: "#3E3E3E",
            fontSize: "28.64px",
            fontWeight: 600,
          }}
        >
          Agent Performance table
        </Typography>
        <ReusableTable
          columns={columns}
          data={filteredTicketData}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={false}
          enableRowSelection={false}
          pageSize={10}
        />
      </div>
      <AnalyticsProgressBarCard />
    </div>
  );
}

export default Analytics;
