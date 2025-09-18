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
import React from "react";
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
const PhoneScrube = () => {
  const [tab, setTab] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [checked, setChecked] = React.useState({
    tcpA: false,
    dns: false,
    federalDNC: false,
    stateDNC: false,
    verizonWireless: false,
    telnyxOCN: false,
    dncTrolls: false,
  });

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

  return (
    <Box mt={4}>
      <ScrubCard
        title={"Step 01 - Choose Scrub Type"}
        desc={"Select your preferred scrubbing method"}
      >
        <Box sx={{ display: "flex", gap: 5, mt: 6, mb: 8 }}>
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
              <Box sx={{ display: "flex", gap: "22px", alignItems: "start" }}>
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
                    sx={{ fontSize: "24px", mb: 1, fontWeight: 600 }}
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
                    sx={{ fontSize: "24px", mb: 1, fontWeight: 600 }}
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
              placeholder="Enter Phone Number"
              className="scrub-number-search"
            />{" "}
            <Button className="scrub-number-search-btn">Start Scrub</Button>
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
              <FileUploader />
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
                    background: checked.tcpA
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    width: "240px",
                    color: checked.tcpA ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.tcpA}
                      onChange={handleChangeCheck}
                      name="tcpA"
                    />
                  }
                  label="TCPA/TCPA Troll"
                />
                <FormControlLabel
                  sx={{
                    background: checked.dns
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.dns ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.dns}
                      onChange={handleChangeCheck}
                      name="dns"
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
                    background: checked.stateDNC
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.stateDNC ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.stateDNC}
                      onChange={handleChangeCheck}
                      name="stateDNC"
                    />
                  }
                  label="State DNC"
                />
                <FormControlLabel
                  sx={{
                    background: checked.verizonWireless
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.verizonWireless ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.verizonWireless}
                      onChange={handleChangeCheck}
                      name="verizonWireless"
                    />
                  }
                  label="Verizon Wireless"
                />
                <FormControlLabel
                  sx={{
                    background: checked.telnyxOCN
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.telnyxOCN ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.telnyxOCN}
                      onChange={handleChangeCheck}
                      name="telnyxOCN"
                    />
                  }
                  label="Telnyx OCN"
                />
                <FormControlLabel
                  sx={{
                    background: checked.dncTrolls
                      ? "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)"
                      : "white",
                    width: "240px",

                    py: 1,
                    pr: 1,
                    pl: 3,
                    borderRadius: "10px",
                    color: checked.dncTrolls ? "white" : "#797979",
                    border: "1px solid #32ABB1",
                  }}
                  control={
                    <Checkbox
                      checked={checked.dncTrolls}
                      onChange={handleChangeCheck}
                      name="dncTrolls"
                    />
                  }
                  label="DNC Trolls"
                />
              </FormGroup>
            </Box>

            <Button className="scrub-number-search-btn" sx={{ mt: 3, ml: 0 }}>
              Start Scrub
            </Button>
          </ScrubCard>
        </>
      )}

      <ScrubCardTable
        title={"Scrub History"}
        desc={"View and manage your previous scrub jobs"}
        filters={
          <>
            <FilterSelect
              value={status}
              onChange={handleChange}
              options={[
                { label: "Active", value: "active" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
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
                  <Image src={viewIcon} width={22} height={22} alt="download" />
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button className="scrub-show-all">Show All</Button>
          </Box>
        </Box>
      </ScrubCardTable>
    </Box>
  );
};

export default PhoneScrube;
