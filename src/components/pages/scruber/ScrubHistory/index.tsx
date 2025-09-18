"use client";
import ScrubCardTable from "@/components/Scrub/Card/Table";
import FilterSelect from "@/components/Scrub/Select";
import ReusableTable from "@/components/Scrub/Table/ReusableTable";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";
import React, { useState } from "react";
import KPIsHistory from "@/components/Scrub/History/KPIsHistory";
import viewIcon from "@/assets/scruber/icons/view.png";
import downloadIcon from "@/assets/scruber/icons/download.png";
import matchIcon from "@/assets/scruber/icons/status-close.png";
import clearIcon from "@/assets/scruber/icons/status-check.png";
import deleteIcon from "@/assets/scruber/icons/delete.png";
import Image from "next/image";
import ReuseableDatePicker from "@/components/common/react-day-date-picker/ReuseableDatePicker";
import MyScruberModal from "@/components/Scrub/Modal";

const ScrubHistory = () => {
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  const columns = [
    { key: "scrubHistory", label: "Upload Time", sortable: true },
    { key: "uploadedFile", label: "Uploaded Number/File", sortable: true },
    { key: "scrubAgainst", label: "Scrub Against", sortable: true },
    { key: "totalNumbers", label: "Total Numbers", sortable: true },
    { key: "badNumbers", label: "Bad Numbers", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) =>
        value === "Completed" ? (
          <Chip
            icon={
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#16C60C",
                  ml: 1,
                }}
              />
            }
            label="Completed"
            sx={{
              backgroundColor: "#DBFCE7",
              color: "#16C60C",
              fontWeight: 500,
              pl: 1,
            }}
          />
        ) : (
          <Chip
            icon={
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#0078D7",
                  ml: 1,
                }}
              />
            }
            label="In Progress"
            sx={{
              backgroundColor: "#DBEAFE",
              color: "#0078D7",
              fontWeight: 500,
              pl: 1,
            }}
          />
        ),
    },
  ];

  const data = [
    {
      scrubHistory: "2024-01-15 14:30",
      uploadedFile: "leads_batch_001.csv",
      scrubAgainst: "All Validators",
      totalNumbers: 5000,
      badNumbers: 342,
      status: "Completed",
    },
    {
      scrubHistory: "2024-01-15 12:15",
      uploadedFile: "marketing_list.xlsx",
      scrubAgainst: "TCPA, Federal DNC",
      totalNumbers: 2500,
      badNumbers: 156,
      status: "Completed",
    },
    {
      scrubHistory: "2024-01-15 10:45",
      uploadedFile: "+1 (555) 123-4567",
      scrubAgainst: "All Validators",
      totalNumbers: 1,
      badNumbers: 0,
      status: "Completed",
    },
    {
      scrubHistory: "2024-01-15 09:30",
      uploadedFile: "cold_leads.csv",
      scrubAgainst: "All Validators",
      totalNumbers: 8000,
      badNumbers: 0,
      status: "In Progress",
    },
  ];

  const statusArr = [
    { name: "TCPA Troll", type: "Match" },
    {
      name: "DNS Complainers",
      type: "Clear",
    },
    {
      name: "TCPA Troll",
      type: "Match",
    },
    {
      name: "DNS Complainers",
      type: "Clear",
    },
    {
      name: "DNS Complainers",
      type: "Clear",
    },
    {
      name: "DNS Complainers",
      type: "Clear",
    },
    {
      name: "TCPA Troll",
      type: "Match",
    },
  ];

  return (
    <Box>
      <KPIsHistory />

      <Box mt={4} mb={2}>
        <ScrubCardTable
          title={"Scrub History"}
          desc={"View and manage your previous scrub jobs"}
          filters={
            <>
              <ReuseableDatePicker
                value={selectedDate}
                onChange={(range) => {
                  console.log("Final range:", range);
                  setSelectedDate(range);
                }}
                minDate={new Date(2023, 0, 1)}
                maxDate={new Date(2025, 11, 31)}
              />

              <FilterSelect
                value={status}
                onChange={handleChange}
                options={[
                  { label: "Valid", value: "Valid" },
                  { label: "Bad", value: "Bad" },
                  { label: "TCPA Match", value: "TCPA Match" },
                ]}
              />

              <Box
                sx={{
                  p: 1.3,
                  border: "1px solid #0000003d",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <SearchOutlined sx={{ color: "#787878", fontSize: "28px" }} />

                <input
                  type="text"
                  placeholder="Search Phone Number"
                  style={{ border: "none", outline: "none", fontSize: "16px" }}
                />
              </Box>
            </>
          }
        >
          <Box sx={{ mt: 3 }}>
            <ReusableTable
              columns={columns}
              data={data}
              actions={(row) => (
                <>
                  <Button
                    sx={{ p: 0, mx: 1, width: "fit-content", minWidth: "10px" }}
                    title="View"
                  >
                    <Image
                      src={viewIcon}
                      width={22}
                      height={22}
                      alt="download"
                    />
                  </Button>
                  <Button
                    sx={{ p: 0, mx: 1, width: "fit-content", minWidth: "10px" }}
                    title="Download"
                  >
                    <Image
                      src={downloadIcon}
                      width={16}
                      height={16}
                      alt="download"
                    />
                  </Button>
                  <Button
                    sx={{ p: 0, mx: 1, width: "fit-content", minWidth: "10px" }}
                    title="Delete"
                  >
                    <Image
                      src={deleteIcon}
                      width={15}
                      height={18}
                      alt="download"
                    />
                  </Button>
                </>
              )}
            />
          </Box>
        </ScrubCardTable>
      </Box>
      <MyScruberModal
        modalHeader="true"
        modalTitle="Scrub Result -+1 (555) 123-4567"
        modalText="Scrub Time: Today,2:45 PM"
        statusBtn="Completed"
        open={open}
        onCloseModal={() => setOpen(false)}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {statusArr?.map((item, index) => (
              <Box key={index} className="scruber-status-box">
                <Image
                  src={
                    item.type === "Match"
                      ? matchIcon
                      : item.type === "Clear"
                      ? clearIcon
                      : clearIcon
                  }
                  width={60}
                  height={60}
                  alt="download"
                />
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    textAlign: "center",
                    color: item.type === "Match" ? "#FF293D" : "#7AC899",
                  }}
                >
                  {item.type}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", mt: 1, textAlign: "center" }}
                >
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </MyScruberModal>
    </Box>
  );
};

export default ScrubHistory;
