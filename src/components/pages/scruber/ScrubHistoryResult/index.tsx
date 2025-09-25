"use client";
import ScrubCardTable from "@/components/Scrub/Card/Table";
import ScruberKPIs from "@/components/Scrub/History/KPIs";
import FilterSelect from "@/components/Scrub/Select";
import ReusableTable from "@/components/Scrub/Table/ReusableTable";
import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Chip } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import viewIcon from "@/assets/scruber/icons/view.png";
import downloadIcon from "@/assets/scruber/icons/download.png";
import deleteIcon from "@/assets/scruber/icons/delete.png";
import ScruberKPIsResult from "@/components/Scrub/History/KPIs";
import { useApiStore } from "@/lib/api/apiStore";
import { useQuery } from "@tanstack/react-query";

const ScrubHistoryResult = () => {
  const { jobHistory, callApi } = useApiStore();
  const [status, setStatus] = useState("");
  const jobId = new URLSearchParams(window.location.search).get("id");
  const {
    data: jobData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`jobHistory`],
    queryFn: () => callApi(jobHistory, { jobId: jobId }),
  });
  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  const columns = [
    { key: "phoneNumber", label: "Phone Number", sortable: true },

    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) =>
        value === "good" ? (
          <Chip
            label="Valid"
            sx={{
              backgroundColor: "#DBFCE7",
              color: "#16C60C",
              fontWeight: 500,
            }}
          />
        ) : value === "bad" ? (
          <Chip
            label="Bad"
            sx={{
              backgroundColor: "#FFF3EA",
              color: "#D97C1E",
              fontWeight: 500,
            }}
          />
        ) : (
          <Chip
            label="Null"
            sx={{
              backgroundColor: "#FEF4FE",
              color: "#FF5BFF",
              fontWeight: 500,
            }}
          />
        ),
    },
    { key: "reason", label: "Reason", sortable: true },
  ];

  const data = jobData?.numbers?.map((item) => ({
    phoneNumber: item.number,
    status: item.status,
    reason: (
      <Box>
        {item.validator.split(",").map((item, index) => (
          <Chip
            key={index}
            label={
              item === "troll"
                ? "DNC Trolls"
                : item === "telnyx"
                ? "Telnyx OCN"
                : item === "federalDNC"
                ? "Federal DNC"
                : item === "dnc_complainers"
                ? "DNC Complainers"
                : item === "state_dnc"
                ? "State DNC"
                : item === "tcpa"
                ? "TCPA/TCPA Troll"
                : item === "Verizon Wireless"
                ? "Verizon Wireless"
                : item
            }
            sx={{
              color:
                index == 0
                  ? "#75C8CE"
                  : index == 1
                  ? "#FF5BFF"
                  : index == 2
                  ? "#D97C1E"
                  : index == 3
                  ? "#16C60C"
                  : index == 4
                  ? "#000000"
                  : "#F34C4C",
              backgroundColor:
                index == 0
                  ? "#E4F9FE"
                  : index == 1
                  ? "#FEF4FE"
                  : index == 2
                  ? "#FFF3EA"
                  : index == 3
                  ? "#DBFCE7"
                  : index == 4
                  ? "#E0E0E0"
                  : "#FFEAEA",
              fontWeight: 500,
              m: 0.5,
            }}
          />
        ))}
        {/* {item.validator.split(",").length > 2 && (
          <Chip
            label={`+${item.validator.split(",").length - 2}`}
            sx={{
              color: "#0000007A",
              backgroundColor: "transparent",
              fontWeight: 500,
            }}
          />
        )} */}
      </Box>
    ),
  }));

  return (
    <Box>
      <ScruberKPIsResult
        validatorCounts={jobData?.validatorCounts}
        totalNumbers={jobData?.totalNumbers}
        badNumbers={jobData?.badNumbers}
        goodNumbers={jobData?.goodNumbers}
      />

      <Box mt={4} mb={2}>
        <ScrubCardTable
          title={"Scrub Results"}
          desc={""}
          filters={
            <>
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
                  style={{ border: "none", outline: "none", fontSize: "16px" }}
                />
              </Box>
            </>
          }
        >
          <Box sx={{ mt: 3 }}>
            <ReusableTable columns={columns} data={data} Pagination={true} />
          </Box>
        </ScrubCardTable>
      </Box>
    </Box>
  );
};

export default ScrubHistoryResult;
