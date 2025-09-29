"use client";
import ScrubCard from "@/components/Scrub/Card";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import singleSeach from "@/assets/scruber/icons/single-search.png";
import bulkSeach from "@/assets/scruber/icons/bulk-search.png";
import viewIcon from "@/assets/scruber/icons/view.png";
import downloadIcon from "@/assets/scruber/icons/download.png";
import deleteIcon from "@/assets/scruber/icons/delete.png";
import Image from "next/image";
import ScrubCardTable from "@/components/Scrub/Card/Table";
import ReusableTable from "@/components/Scrub/Table/ReusableTable";
import FileUploader from "@/components/Scrub/DragDrop";
import FilterSelect from "@/components/Scrub/Select";
import { SearchOutlined } from "@mui/icons-material";
import { useApiStore } from "@/lib/api/apiStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getSocket } from "@/utils/socket";
import MyScruberModal from "@/components/Scrub/Modal";
import matchIcon from "@/assets/scruber/icons/status-close.png";
import clearIcon from "@/assets/scruber/icons/status-check.png";
import Link from "next/link";
import { imageUrl } from "@/lib/constants/variables";
import { usePermission } from "@/hooks/usePermission";
import MyModal from "@/components/common/Modal";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon2.svg";
import CustomButton from "@/components/common/Button/Button";
import deleteModalDeleteIcon from "@/assets/icons/users/delete-icon-2.png";

const PhoneScrube = () => {
  const {
    searchSingleNumber,
    searchBulkNumber,
    callApi,
    profile,
    scrubHistory,
    deleteJobHistory,
  }: any = useApiStore();

  const queryClient = useQueryClient();

  const canDownloadHistory = usePermission("Download history");
  const canViewHistory = usePermission("View history");
  const canDeleteHistory = usePermission("Delete History");

  const canViewRunSingleScruber = usePermission("Run Single Search");
  const canViewRunBulkScruber = usePermission("Run Bulk Search");

  const filterLabels: Record<string, string> = {
    tcpa: "TCPA Troll",
    dnc_complainers: "DNS Complainers",
    federalDNC: "Federal DNC",
    state_dnc: "State DNC",
    "Verizon Wireless": "Verizon Wireless",
    telnyx: "Telnyx OCN",
    troll: "DNC Trolls",
  };

  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState("");
  const [responseType, setResponseType] = useState("");
  const [numberStatus, setNumberStatus] = useState(null);
  const [ss, setSS] = useState(null);

  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const {
    data: scrubData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`scrubHistory`],
    queryFn: () => callApi(scrubHistory),
  });

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

  const [checked, setChecked] = useState({
    tcpa: false,
    dnc_complainers: false,
    federalDNC: false,
    state_dnc: false,
    "Verizon Wireless": false,
    telnyx: false,
    troll: false,
  });

  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  useEffect(() => {
    if (!profile?.data?.user_id) return;

    const socket = getSocket();

    socket.emit("registerUser", profile.data.user_id);

    socket.on("scrubJobCompleted", (data) => {
      console.log("🟢 Scrub Job Completed:", data);
      setNumberStatus(data?.numbers?.[0]?.validator || null);
      setSS(data?.numbers?.[0]?.status || null);
      tab == 0 && setOpen(true);
      queryClient.invalidateQueries({ queryKey: ["scrubHistory"] });
    });

    socket.on("registerUser", (notification) => {
      console.log("New Scrub Notification:", notification);

      // 🔔 Show desktop notification safely
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(notification?.message || "New Notification", {
            body: notification?.actor?.name || "You have a new update",
            icon: notification?.actor?.image
              ? imageUrl + notification.actor.image
              : "/default-icon.png", // fallback
          });
        }
      }
    });

    return () => {
      socket.off("scrubJobCompleted");
      socket.off("scrub_job_complete");
    };
  }, [profile?.data?.user_id]);

  const handleChangeCheck = (event) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };
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
    ?.slice(0, 4)
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

  const singleNumberMutation = useMutation({
    mutationFn: (data) => callApi(searchBulkNumber, data),
    // mutationFn: (data) => callApi(searchSingleNumber, data),
    onSuccess: (res: any) => {
      // ✅ res is your API response here

      if (res?.jobId) {
        setCurrentJobId(res.jobId); // save jobId for socket listener
      }
      queryClient.invalidateQueries({ queryKey: ["scrubHistory"] });

      toast.success("Scrubing... We will notify you once it's done.");
      setResponseType("single");
    },
    onError: (error: any) => {
      toast.error("Failed to upload numbers: " + error.message);
    },
  });
  const bulkNumberMutation = useMutation({
    mutationFn: (data) => callApi(searchBulkNumber, data),
    onSuccess: (res: any) => {
      // ✅ res is your API response here

      if (res?.jobId) {
        setCurrentJobId(res.jobId); // save jobId for socket listener
      }

      toast.success("Scrubing... We will notify you once it's done.");
      queryClient.invalidateQueries({ queryKey: ["scrubHistory"] });

      setFile(null);
      setChecked({
        tcpa: false,
        dnc_complainers: false,
        federalDNC: false,
        state_dnc: false,
        "Verizon Wireless": false,
        telnyx: false,
        troll: false,
      });
      setResponseType("bulk");
    },
    onError: (error: any) => {
      toast.error("Failed to upload numbers: " + error.message);
    },
  });

  const handleFileUpload = (files: any) => {
    if (!files) {
      return;
    }
    console.log(files);

    setFile(files);
  };

  const StartScrub = () => {
    if (tab == 1) {
      // Values to send to API
      const activeFilterValues = Object.keys(checked).filter(
        (key) => checked[key]
      );

      // Labels to show in UI
      const activeFilterLabels = activeFilterValues.map(
        (key) => filterLabels[key]
      );

      const filters = activeFilterValues;

      const formData: any = new FormData();
      formData.append("file", file);
      filters?.forEach((filter) => {
        formData.append("filters[]", filter);
      });
      bulkNumberMutation.mutate(formData);
    }

    if (tab == 0) {
      const payload = {
        number: search,
        filters: [
          "tcpa",
          "dnc_complainers",
          "federalDNC",
          "state_dnc",
          "Verizon Wireless",
          "telnyx",
          "troll",
        ],
      };
      singleNumberMutation.mutate(payload);
    }
  };

  const statusArr = [
    { name: "tcpa" },
    {
      name: "dnc_complainers",
    },
    {
      name: "Federal DNC",
    },
    {
      name: "state_dnc",
    },
    {
      name: "Verizon Wireless",
    },
    {
      name: "telnyx",
    },
    {
      name: "troll",
    },
  ];

  const validatorArr = numberStatus
    ? numberStatus?.split(",").map((v) => v.trim().toLowerCase())
    : [];

  return (
    <Box mt={4}>
      <ScrubCard
        title={"Choose Scrub Type"}
        desc={"Select your preferred scrubbing method"}
      >
        <Box
          sx={{ display: "flex", gap: 4, mt: 6, mb: 8 }}
          className="scrub-tabs"
        >
          {canViewRunSingleScruber && (
            <section
              className={`card-scruber ${tab === 0 ? "active" : ""}`}
              onClick={() => setTab(0)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{ display: "flex", gap: "22px", alignItems: "start" }}
                  className="scrub-tab"
                >
                  <Image
                    src={singleSeach}
                    width={50}
                    height={50}
                    alt="single-search"
                    style={{ marginTop: "10px" }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: "24px",
                        mb: 1,
                        fontWeight: 600,
                        color: "#183C58",
                      }}
                    >
                      Single Number Search
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "18px",
                        color: "#B1B1B1",
                        lineHeight: "34px",
                      }}
                    >
                      Quickly scrub a single phone number against all validators
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </section>
          )}
          {canViewRunBulkScruber && (
            <section
              className={`card-scruber ${tab === 1 ? "active" : ""}`}
              onClick={() => setTab(1)}
              style={{ border: tab === 1 && "2px solid #2BBBAC !important" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
                className={"scrub-tab"}
              >
                <Box sx={{ display: "flex", gap: "22px" }}>
                  <Image
                    src={bulkSeach}
                    width={50}
                    height={50}
                    alt="single-search"
                    style={{ marginTop: "5px" }}
                  />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: "24px",
                        mb: 1,
                        fontWeight: 600,
                        color: "#183C58",
                      }}
                    >
                      Bulk Search (File Upload)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "18px",
                        color: "#B1B1B1",
                        lineHeight: "34px",
                      }}
                    >
                      Upload a file and select specific validators for batch
                      processing
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </section>
          )}
        </Box>
      </ScrubCard>

      {tab === 0 && (
        <ScrubCard
          title={"Step 1 - Enter Number"}
          desc={"This will automatically scrub against all validators."}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 6,
              mb: 3,
              background: "#FAFAFA",
              p: 3,
              borderRadius: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Enter 10-digit number with country code"
              className="scrub-number-search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />{" "}
            <Button
              className="scrub-number-search-btn"
              onClick={StartScrub}
              disabled={!search}
            >
              Start Scrub
            </Button>
          </Box>
        </ScrubCard>
      )}
      {tab === 1 && (
        <>
          <ScrubCard
            title={"Step 1 – Import File"}
            desc={"Upload your file for bulk processing"}
          >
            <Box mt={6}>
              <FileUploader handleFileUpload={handleFileUpload} />
            </Box>
          </ScrubCard>
          <ScrubCard
            title={"Step 2 – Select Validators"}
            desc={"Select the validators to scrub against"}
          >
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <FormGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: 1,
                }}
                className="scrub-checks"
              >
                <FormControlLabel
                  sx={{
                    background: checked.tcpa
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    width: "240px",
                    color: checked.tcpa ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.tcpa}
                      onChange={handleChangeCheck}
                      name="tcpa"
                    />
                  }
                  label="TCPA/TCPA Troll"
                />
                <FormControlLabel
                  sx={{
                    background: checked.dnc_complainers
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",
                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.dnc_complainers ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.dnc_complainers}
                      onChange={handleChangeCheck}
                      name="dnc_complainers"
                    />
                  }
                  label="DNS Complainers"
                />
                <FormControlLabel
                  sx={{
                    background: checked.federalDNC
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.federalDNC ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.federalDNC}
                      onChange={handleChangeCheck}
                      name="federalDNC"
                    />
                  }
                  label="Federal DNC"
                />
                <FormControlLabel
                  sx={{
                    background: checked.state_dnc
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.state_dnc ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.state_dnc}
                      onChange={handleChangeCheck}
                      name="state_dnc"
                    />
                  }
                  label="State DNC"
                />
                <FormControlLabel
                  sx={{
                    background: checked["Verizon Wireless"]
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked["Verizon Wireless"] ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked["Verizon Wireless"]}
                      onChange={handleChangeCheck}
                      name="Verizon Wireless"
                    />
                  }
                  label="Verizon Wireless"
                />
                <FormControlLabel
                  sx={{
                    background: checked.telnyx
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.telnyx ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.telnyx}
                      onChange={handleChangeCheck}
                      name="telnyx"
                    />
                  }
                  label="Telnyx OCN"
                />
                <FormControlLabel
                  sx={{
                    background: checked.troll
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.troll ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.troll}
                      onChange={handleChangeCheck}
                      name="troll"
                    />
                  }
                  label="DNC Troll"
                />
              </FormGroup>
            </Box>

            <Button
              className="scrub-number-search-btn"
              sx={{ mt: 3, ml: 0 }}
              onClick={StartScrub}
              disabled={!file}
            >
              Start Scrub
            </Button>
          </ScrubCard>
        </>
      )}

      <ScrubCardTable
        title={"Scrub History"}
        desc={"View and manage your previous scrub history"}
        filters={
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              width: "100%",
            }}
          >
            <FilterSelect
              value={status}
              onChange={handleChange}
              options={[
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
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
              <SearchOutlined sx={{ color: "#787878", fontSize: "25px" }} />

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
            columns={columns}
            data={data}
            actions={(row) => {
              console.log(row);
              return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Link
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
              textDecoration: "none",
            }}
            href="/scruber/history-scruber"
          >
            <Button className="scrub-show-all">Show All</Button>
          </Link>
        </Box>
      </ScrubCardTable>
      <MyScruberModal
        modalHeader="true"
        modalTitle={`Scrub Result - +1 ${search}`}
        modalText={`Scrub Time: Today, ${new Date().toLocaleTimeString()} `}
        statusBtn={ss}
        open={open}
        setOpen={setOpen}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {statusArr?.map((item, index) => {
              const exists = validatorArr.includes(item.name.toLowerCase());

              return (
                <Box key={index} className="scruber-status-box">
                  <Image
                    src={!exists ? clearIcon : matchIcon}
                    width={60}
                    height={60}
                    alt="status"
                  />
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      textAlign: "center",
                      color: !exists ? "#7AC899" : "#FF293D",
                    }}
                  >
                    {!exists ? "Clear" : "Match"}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", mt: 1, textAlign: "center" }}
                  >
                    {item.name === "troll"
                      ? "DNC Trolls"
                      : item.name === "telnyx"
                      ? "Telnyx OCN"
                      : item.name === "federalDNC"
                      ? "Federal DNC"
                      : item.name === "dnc_complainers"
                      ? "DNC Complainers"
                      : item.name === "state_dnc"
                      ? "State DNC"
                      : item.name === "tcpa"
                      ? "TCPA/TCPA Troll"
                      : item.name === "Verizon Wireless"
                      ? "Verizon Wireless"
                      : item.name}
                  </Typography>
                </Box>
              );
            })}
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

export default PhoneScrube;
