import * as React from "react";
import { Box, Typography } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import ClockIcon from "@/assets/icons/contact-center/auto-attendants/autoAttendnatClockicon.svg";

interface TimeRangePickerProps {
  onChange: (range: { fromTime: Dayjs | null; toTime: Dayjs | null }) => void;
  defaultFromTime?: Dayjs;
  defaultToTime?: Dayjs;
}

export default function TimeRangePicker({
  onChange,
  defaultFromTime = dayjs().startOf("day"),
  defaultToTime = dayjs().endOf("day"),
}: TimeRangePickerProps) {
  const [fromTime, setFromTime] = React.useState<Dayjs | null>(defaultFromTime);
  const [toTime, setToTime] = React.useState<Dayjs | null>(defaultToTime);

  const handleFromTimeChange = (newValue: Dayjs | null) => {
    setFromTime(newValue);
    if (newValue && toTime && newValue.isAfter(toTime)) {
      setToTime(newValue); // Ensure toTime is not before fromTime
    }
    onChange({ fromTime: newValue, toTime });
  };

  const handleToTimeChange = (newValue: Dayjs | null) => {
    setToTime(newValue);
    if (newValue && fromTime && newValue.isBefore(fromTime)) {
      setFromTime(newValue); // Ensure fromTime is not after toTime
    }
    onChange({ fromTime, toTime: newValue });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="body1"
            color="initial"
            sx={{ color: "#00000060" }}
          >
            Time
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            className="main-time-range-picker"
          >
            {" "}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TimePicker
                label="From Time"
                value={fromTime}
                onChange={handleFromTimeChange}
                minTime={dayjs("00:00", "HH:mm")} // Start of day
                maxTime={dayjs("23:59", "HH:mm")} // End of day
              />
              -
              <TimePicker
                label="To Time"
                value={toTime}
                onChange={handleToTimeChange}
                minTime={fromTime || dayjs("00:00", "HH:mm")} // Restrict to not before fromTime
                maxTime={dayjs("23:59", "HH:mm")} // End of day
              />
            </Box>
          </Box>
        </Box>
      </DemoContainer>
    </LocalizationProvider>
  );
}
