"use client";
import { Badge, Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationsIcon from "@/assets/icons/dashboard/notificationIcon.svg";
import AccountMenu from "@/components/layout/Sidebar/AccountMenu";
import Image from "next/image";
import Notifications from "../common/Notification";
import { getSocket } from "@/utils/socket";
import { useApiStore } from "@/lib/api/apiStore";
import { useQuery } from "@tanstack/react-query";
import { imageUrl } from "@/lib/constants/variables";

function DashboardHeader({ title, text }: any) {
  const { profile, fetchSingleTicket, callApi }: any = useApiStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationRefetch, setNotificationRefetch] = useState(false);

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`notifications`, notificationRefetch],
    queryFn: () =>
      callApi(fetchSingleTicket, { requestType: "getNotifications" }),
    enabled: !!profile?.data?.user_id || notificationRefetch,
  });

  useEffect(() => {
    if (!profile?.data?.user_id) return; // wait for profile to load

    // 🔔 Ask for permission as soon as component mounts
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }

    const socket = getSocket();

    socket.emit("registerUser", profile?.data?.user_id);

    socket.on("newNotification", (notification) => {
      console.log("New Notification:", notification);

      // Update state
      setNotifications((prev) => [notification, ...prev]);
      setNotificationRefetch((prev) => !prev);

      // 🔔 Show desktop notification (only if granted already)
      if (Notification.permission === "granted") {
        new Notification(notification.message || "New Notification", {
          body: notification.actor.name || "You have a new update",
          icon: imageUrl + notification.actor.image, // put icon in /public
        });
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [profile?.data?.user_id]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <div
      className="main-dashboardHeader"
      style={{ paddingBottom: "15px", borderBottom: "2px solid #E4E4E7" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" className="header-title">
            {title || "title"}
          </Typography>
          <Typography>{text ? text : ""}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton
            size="large"
            color="inherit"
            sx={{ padding: 0 }}
            onClick={handleClick}
          >
            <Badge
              badgeContent={
                notificationsData?.filter((item) => !item.is_read)?.length
              }
              color="error"
            >
              <Image src={NotificationsIcon} alt="notifications" />
            </Badge>
          </IconButton>

          {anchorEl && (
            <Notifications
              handleClose={handleClose}
              notifications={notificationsData} // 👈 pass list
            />
          )}
          {/* <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            sx={{ padding: 0 }}
          >
            <Image src={SettingIcon} alt='' />
          </IconButton> */}
          <AccountMenu />
        </Box>
      </Box>
    </div>
  );
}

export default DashboardHeader;
