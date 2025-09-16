import { Box } from "@mui/material";
import React from "react";
import NotificationList from "./NotificationList";

const Notifications = ({ handleClose, notifications }) => {
  return (
    <>
      <NotificationList notifications={notifications} />
      <Box className="notifications" onClick={handleClose}></Box>
    </>
  );
};

export default Notifications;
