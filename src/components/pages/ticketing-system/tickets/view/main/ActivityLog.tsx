"use client";
import React from "react";
import { Box, Typography, Avatar, Chip, Button, Grid } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import profileImg from "@/assets/images/profile/small-profile.png";

import Image from "next/image";
import icon1 from "@/assets/icons/unibox/ticket/viewpage/created.svg";
import icon2 from "@/assets/icons/unibox/ticket/viewpage/assigned.svg";
import icon3 from "@/assets/icons/unibox/ticket/viewpage/attatch.svg";
import icon4 from "@/assets/icons/unibox/ticket/viewpage/msg1.svg";
import icon5 from "@/assets/icons/unibox/ticket/viewpage/msg2.svg";
import icon6 from "@/assets/icons/unibox/ticket/viewpage/priority.svg";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import { imageUrl } from "@/lib/constants/variables";
const ActivityLog = ({ activityData }) => {
  const [filter, setFilter] = React.useState("all");
  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };
  return (
    <Box
      sx={{
        p: 2.4,
        backgroundColor: "#fff",
        borderRadius: "10px",
        filter: "drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))",
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          mb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Grid size={{ lg: 6, xs: 12 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Activity Log
          </Typography>
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <TableSelectFilterMainNew
            value={filter}
            name={"activityFilter"}
            options={[
              { value: "all", label: "All" },
              { value: "replies", label: "Replies" },
              { value: "ticket", label: "Ticket" },
            ]}
            popperClassName="department-filter"
            defaultText="All"
            className="table-dropdown-select view"
            onChange={handleFilterChange}
          />
        </Grid>

        {/* <Button
          variant='outlined'
          sx={{
            borderRadius: '20px',
            p: '4px 12px',
            color: '#2196f3',
            borderColor: '#2196f3'
          }}
        >
          Assignments
        </Button> */}
      </Grid>

      {activityData
        .filter((log) =>
          filter === "ticket"
            ? log.description.startsWith("Ticket")
            : filter === "replies"
            ? log.description.startsWith("Reply")
            : true
        )
        ?.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              backgroundColor: "var(--pri-light-color)",
              borderRadius: "10px",
              p: 1.8,
              mb: 1.6,
              display: "flex",
              // alignItems: "center",
              border: "1px solid var(--pri-light-color)",
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                backgroundColor: "var(--pri-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
                color: "#fff",
                padding: "9px",
              }}
            >
              {/* {activity.type === 'TicketCreated' && ( */}
              <Image
                src={icon1}
                alt="icon"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              {/* )} */}
              {/* {activity.type === 'TicketAssigned' && (
              <Image
                src={icon2}
                alt='icon'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {activity.type === 'FileAttached' && (
              <Image
                src={icon3}
                alt='icon'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {activity.type === 'Customerreplied' && (
              <Image
                src={icon4}
                alt='icon'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {activity.type === 'Agentreplied' && (
              <Image
                src={icon5}
                alt='icon'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {activity.type === 'Priorityupdated' && (
              <Image
                src={icon6}
                alt='icon'
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )} */}
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
              >
                {activity.description}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Avatar
                  alt={activity?.user?.full_name}
                  src={imageUrl + activity?.user?.picture}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography sx={{ color: "#666", fontSize: "14px" }}>
                  {activity?.user?.full_name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: "#666", mr: 0.5 }}
                />
                <Typography sx={{ color: "#666", fontSize: "12px" }}>
                  {new Date(activity.updatedAt).toDateString()}
                </Typography>
              </Box>
              {/* {activity.fileName && (
              <Typography
                sx={{
                  backgroundColor: '#EDFEFF',
                  py: 0.5,
                  px: 1,
                  borderRadius: '5px',
                  border: '1px solid #32ABB1',
                  mt: 0.5,
                  display: 'inline-block',
                  fontSize: '14px'
                }}
              >
                {activity.fileName}
              </Typography>
            )}
            {activity.oldPriority && activity.newPriority && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={activity.oldPriority}
                  sx={{
                    backgroundColor: '#fdc74828',
                    color: '#FDC748',
                    mr: 0.5
                  }}
                />
                <Chip
                  label={activity.newPriority}
                  sx={{ backgroundColor: '#32abb12d', color: '#32AAB1' }}
                />
              </Box>
            )} */}
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default ActivityLog;
