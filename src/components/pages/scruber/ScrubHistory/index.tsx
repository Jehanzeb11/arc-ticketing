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
import { useQuery } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import Link from "next/link";

const ScrubHistory = () => {
  const { callApi, scrubHistory }: any = useApiStore();

  const {
    data: scrubData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`scrubHistory`],
    queryFn: () => callApi(scrubHistory),
  });

  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [numberStatus, setNumberStatus] = useState(null);

  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  const columns = [
    { key: "scrubHistory", label: "Scrub History", sortable: true },
    { key: "uploadedFile", label: "Uploaded Number/File", sortable: true },
    { key: "scrubAgainst", label: "Scrub Against", sortable: true },
    { key: "totalNumbers", label: "Total Numbers", sortable: true },
    { key: "badNumbers", label: "Bad Numbers", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) =>
        value === "completed" ? (
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
        ) : value === "failed" ? (
          <Chip
            icon={
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#be0000ff",
                  ml: 1,
                }}
              />
            }
            label="Failed"
            sx={{
              backgroundColor: "#be00002d",
              color: "#be0000ff",
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

  const data = scrubData?.history?.map((item) => ({
    jobId: item.jobId,
    scrubHistory:
      item?.createdAt.split("T")[0] +
      " " +
      new Date(item?.createdAt).toTimeString().split(" ")[0],
    uploadedFile: "cold_leads.csv",
    scrubAgainst: JSON.parse(item?.filters)?.join(", "),
    totalNumbers: item.totalNumbers,
    badNumbers: item.badNumbers,
    status: item.status,
  }));

  const statusArr = [
    { name: "TCPA Troll", type: "Match" },
    {
      name: "DNS Complainers",
      type: "Clear",
    },
    {
      name: "Federal DNC",
      type: "Match",
    },
    {
      name: "State DNC",
      type: "Clear",
    },
    {
      name: "Verizon Wireless",
      type: "Clear",
    },
    {
      name: "Telnyx OCN",
      type: "Clear",
    },
    {
      name: "DNC Trolls",
      type: "Match",
    },
  ];

  const validatorArr = numberStatus
    ? numberStatus?.split(",").map((v) => v.trim().toLowerCase())
    : [];

  return (
    <Box>
      <KPIsHistory data={scrubData?.history} />

      <Box mt={4} mb={2}>
        <ScrubCardTable
          title={"Scrub History"}
          desc={"View and manage your previous scrub jobs"}
          filters={
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                width: "100%",
              }}
            >
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
                  width: "100%",
                }}
              >
                <SearchOutlined sx={{ color: "#787878", fontSize: "28px" }} />

                <input
                  type="text"
                  placeholder="Search Phone Number"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    width: "100%",
                  }}
                />
              </Box>
            </Box>
          }
        >
          <Box sx={{ mt: 3 }}>
            <ReusableTable
              Pagination={true}
              columns={columns}
              data={data}
              actions={(row) => {
                console.log(row);
                return (
                  <Box sx={{ display: "flex" }}>
                    <Link
                      href={`/scruber/history-scruber-result?id=${row.jobId}`}
                      style={{
                        padding: 0,
                        marginTop: "5px",
                        width: "fit-content",
                        minWidth: "10px",
                      }}
                      title="View"
                    >
                      <Image
                        src={viewIcon}
                        width={22}
                        height={22}
                        alt="download"
                      />
                    </Link>
                    <Button
                      sx={{
                        p: 0,
                        mx: 1,
                        width: "fit-content",
                        minWidth: "10px",
                      }}
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
                      sx={{
                        p: 0,
                        mx: 1,
                        width: "fit-content",
                        minWidth: "10px",
                      }}
                      title="Delete"
                    >
                      <Image
                        src={deleteIcon}
                        width={15}
                        height={18}
                        alt="download"
                      />
                    </Button>
                  </Box>
                );
              }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
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
