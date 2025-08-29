import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateTimePicker,
  MobileDateTimePicker,
  DesktopDateTimePicker,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";

const ReusableDateTimePicker = ({
  label = "Select Date & Time",
  defaultValue = dayjs(), // 👈 changed from fixed date to current date/time
  variant = "mobile", // Options: 'mobile', 'desktop', 'static'
  onChange,
  disabled = false,
  minDateTime,
  maxDateTime,
  ...props
}: any) => {
  const getPickerComponent = () => {
    switch (variant.toLowerCase()) {
      case "desktop":
        return DesktopDateTimePicker;
      case "static":
        return StaticDateTimePicker;
      case "mobile":
      default:
        return MobileDateTimePicker;
    }
  };

  const PickerComponent = getPickerComponent();

  return (
    <div className="main-date-time-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker"]}>
          <DemoItem label={label}>
            <PickerComponent
              defaultValue={defaultValue}
              onChange={onChange}
              disabled={disabled}
              minDateTime={minDateTime}
              maxDateTime={maxDateTime}
              {...props}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default ReusableDateTimePicker;
