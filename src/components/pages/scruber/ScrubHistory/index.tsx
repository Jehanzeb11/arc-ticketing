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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";
import toast from "react-hot-toast";
import MyModal from "@/components/common/Modal";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon2.svg";
import CustomButton from "@/components/common/Button/Button";
import deleteModalDeleteIcon from "@/assets/icons/users/delete-icon-2.png";

const ScrubHistory = () => {
  const queryClient = useQueryClient();

  const { callApi, scrubHistory, deleteJobHistory, validNumbersByJob }: any =
    useApiStore();
  const canDownloadHistory = usePermission("Download history");
  const canViewHistory = usePermission("View history");
  const canDeleteHistory = usePermission("Delete History");

  const {
    data: scrubData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`scrubHistory`],
    queryFn: () => callApi(scrubHistory),
  });

  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [numberStatus, setNumberStatus] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const deleteJobMutation = useMutation({
    mutationFn: (data) => callApi(deleteJobHistory, { id: data }),
    onSuccess: (res: any) => {
      toast.success("Job deleted successfully!");
      setDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["scrubHistory"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete job: " + error.message);
    },
  });

  const validJobMutation = useMutation({
    mutationFn: (data) => callApi(validNumbersByJob, { jobId: data }),
    onSuccess: (res: any) => {
      toast.success("Job validated successfully!");
      setDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["scrubHistory"] });

      // 🔽 Create CSV with just numbers
      if (res?.numbers && Array.isArray(res.numbers)) {
        const numbers = res.numbers.map((n: any) => n.number);

        // Add header + rows
        const csvContent = "number\n" + numbers.join("\n");

        // Blob & download
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "valid-numbers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    onError: (error: any) => {
      toast.error("Failed to validate job: " + error.message);
    },
  });

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

  const data = scrubData?.history
    ?.filter((item) => {
      // ✅ if no status filter selected, allow all
      const statusMatch =
        !status || item.status.toLowerCase() === status.toLowerCase();

      // ✅ if no query entered, allow all
      const queryMatch =
        !query ||
        item.org_filename?.toLowerCase().includes(query.toLowerCase());

      return statusMatch && queryMatch;
    })
    ?.map((item) => ({
      id: item.id,
      jobId: item.jobId,
      scrubHistory:
        item?.createdAt.split("T")[0] +
        " " +
        new Date(item?.createdAt).toTimeString().split(" ")[0],
      uploadedFile: item.org_filename,
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
                  { label: "Completed", value: "Completed" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Failed", value: "Failed" },
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                    {canViewHistory && (
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
                    )}
                    {canDownloadHistory && (
                      <Button
                        sx={{
                          p: 0,
                          mx: 1,
                          width: "fit-content",
                          minWidth: "10px",
                        }}
                        title="Download"
                        onClick={() => validJobMutation.mutate(row.jobId)}
                      >
                        <Image
                          src={downloadIcon}
                          width={16}
                          height={16}
                          alt="download"
                        />
                      </Button>
                    )}
                    {canDeleteHistory && (
                      <Button
                        sx={{
                          p: 0,
                          mx: 1,
                          width: "fit-content",
                          minWidth: "10px",
                        }}
                        title="Delete"
                        onClick={() => {
                          setSelectedId(row.id);
                          setDeleteModal(true);
                        }}
                      >
                        <Image
                          src={deleteIcon}
                          width={15}
                          height={18}
                          alt="download"
                        />
                      </Button>
                    )}
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
          Are you sure you want to permanently delete this record? This action
          cannot be undone.
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
              if (selectedId) {
                deleteJobMutation.mutate(selectedId);
              }
            }}
          />
        </Box>
      </MyModal>
    </Box>
  );
};

export default ScrubHistory;
