"use client";
import React, { useState } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import { Box, Button, Grid, Typography } from "@mui/material";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import Image from "next/image";
import CustomButton from "@/components/common/Button/Button";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import totalTicketIcon from "@/assets/icons/analytics/totaltockets.png";
import ticketsResolvedIcon from "@/assets/icons/analytics/resolvedtickets.svg";
import ticketsOpenIcon from "@/assets/icons/analytics/opentickets.svg";
import avgResponseTimeIcon from "@/assets/icons/analytics/avgticket.svg";
import ReusableTable from "@/components/common/Table/ReusableTable";
import AnalyticsProgressBarCard from "./AnalyticsProgressBarCard";
import { useQuery } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import ReuseableDatePicker from "@/components/common/react-day-date-picker/ReuseableDatePicker";
import { usePermission } from "@/hooks/usePermission";

function Analytics() {
  const { callApi, getAllTickets, fetchDepartments, fetchUsers }: any =
    useApiStore();
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [update, SetUpdate] = useState(false);

  const [filterValues, setFilterValues] = useState({
    department_id: "All",
    type: "All",
    priority: "All",
    assignee: "All",
    status: "All",
  });

  const canFilterAnalytics = usePermission("Filter Analytics"); 
  const canViewAgentsPerformance = usePermission("View Agent Performance Metrics");

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
  });

  const { data: users } = useQuery({
    queryKey: ["allusers"],
    queryFn: () =>
      callApi(fetchUsers, {
        requestType: "getAllUsers",
      }),
  });

  const {
    data: ticketKpiStats,
    isLoading: ticketKpiStatsLoading,
    error: ticketKpiStatsError,
  } = useQuery({
    queryKey: ["ticketKpi"],
    queryFn: () => callApi(getAllTickets, { requestType: "ticketKpiStats" }),
  });

  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`analytics_${update}`],
    queryFn: () =>
      callApi(getAllTickets, {
        requestType: "getUserPerformance",
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

  const handleResetFilter = () => {
    setFilterValues({
      department_id: "All",
      type: "All",
      priority: "All",
      assignee: "All",
      status: "All",
    });
    setSelectedDate([null, null]);
    SetUpdate(!update);
  };

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
  ];

  const data =
    (analytics &&
      analytics?.map((ticket: any) => ({
        agentName: ticket.username,
        assigned: ticket.totalTicketsAssigned,
        resolved: ticket.resolvedTickets,
        resolution_rate: ticket.resolutionRate,
        avg_response_time: ticket.avgResponseTime,
        avg_resolution_time: ticket.avgResolutionTime,
        open: ticket.openTickets,
        in_progress: ticket.inProgressTickets,
        closed: ticket.closedTickets,
      }))) ||
    [];

  const filters = [
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
      name: "priority",
      value: filterValues.priority,
      className: "priority-filter",
      filterOptions: [
        { value: "All", label: "All Priorities" },
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
        { value: "All", label: "All Assignees" },
        ...(users?.map((user: any) => ({
          value: user.user_id,
          label: user.full_name,
        })) || []),
      ],
    },
  ];

  console.log(selectedDate);

  return (
    <div className="main-analytics">
      <AnalyticsHeader />
      {canFilterAnalytics && <Grid
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
          <Grid size={{ lg: 1.75, xs: 12 }} key={index}>
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

        <Grid size={{ lg: 1.6, xs: 12 }}>
          <ReuseableDatePicker
            value={selectedDate}
            onChange={(range) => {
              console.log("Final range:", range);
              setSelectedDate(range);
            }}
            minDate={new Date(2023, 0, 1)}
            maxDate={new Date(2025, 11, 31)}
          />
        </Grid>

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
      </Grid>}
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
            {ticketKpiStats?.counts?.total}
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
            {ticketKpiStats?.counts?.resolved}
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
            {ticketKpiStats?.counts?.open}
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
            {ticketKpiStats?.avgResponseTime?.overallReadable}
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
            px: 1,
          }}
        >
          Agent Performance table
        </Typography>
        <ReusableTable
          columns={columns}
          data={data}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={false}
          enableRowSelection={false}
          pageSize={10}
        />
      </div>
     {canViewAgentsPerformance && <AnalyticsProgressBarCard analyticsData={analytics || []} />}
    </div>
  );
}

export default Analytics;
