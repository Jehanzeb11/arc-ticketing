import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import notiIcon from "@/assets/icons/noti-list.png";
import notiDateTime from "@/assets/icons/noti-date-time.png";
import clearNotiIcon from "@/assets/icons/clear-noti.png";
import readNotiIcon from "@/assets/icons/noti-read.png";
import SearchIcon from "@mui/icons-material/Search";
import { useApiStore } from "@/lib/api/apiStore";
import { imageUrl } from "@/lib/constants/variables";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationList = ({ notifications }) => {
  const queryClient = useQueryClient();
  const { profile, callApi, fetchSingleTicket }: any = useApiStore();

  const updateTicketMutation = useMutation({
    mutationFn: ({ notificationId }: any) => {
      const updatedTicket = {
        requestType: "markNotificationRead",
        notificationId,
      };
      return callApi(fetchSingleTicket, updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Ticket updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update ticket:", error);
    },
  });

  const handleMarkAsRead = (notificationId: any) => {
    updateTicketMutation.mutate({ notificationId });
  };

  return (
    <Box
      sx={{
        width: "505px",
        backgroundColor: "white",
        borderRadius: "10px",
        height: "615px",
        position: "absolute",
        top: "100px",
        right: "180px",
        p: 3,
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src={notiIcon} alt="notificationIcon" width={22} height={25} />
          <Typography variant="h6">
            Notifications{" "}
            <span
              style={{
                color: "#3F8CFF",
                padding: "0px 10px",
                background: "#3286BD24",
                borderRadius: "100px",
              }}
            >
              {notifications?.length}
            </span>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src={clearNotiIcon}
            alt="clearNotiIcon"
            width={12}
            height={14}
          />
          <button style={{ fontSize: "16px", color: "#32ABB1" }}>
            Clear All
          </button>
        </Box>
      </Box>

      <Box
        sx={{
          mt: "20px",
          border: "1px solid #D6D6D6",
          p: 1.5,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <SearchIcon sx={{ color: "#686868ff" }} />
        <input
          type="search"
          placeholder="Search or type a command"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "16px",
          }}
        />
      </Box>
      {/* notificatins render */}
      <Box
        sx={{
          overflowY: "scroll",
          height: "465px",
        }}
      >
        {notifications?.map((item) => (
          <Box
            key={item.id}
            sx={{
              mt: "20px",
              border: "1px solid #D6D6D6",
              p: 1.4,
              display: "flex",
              alignItems: "center",
              gap: "16px",
              borderRadius: "20px",
              backgroundColor: item.is_read ? "#fff" : "#F9FAFC",
            }}
          >
            <Image
              src={imageUrl + item.actor.picture}
              alt="notificationIcon"
              width={25}
              height={30}
            />
            <Box sx={{ textAlign: "left", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="h5" sx={{ fontSize: "15px" }}>
                  <b>{item.type}</b>
                  {item.title}
                </Typography>
                <button onClick={() => handleMarkAsRead(item.id)}>
                  <Image
                    src={readNotiIcon}
                    alt="notificationIcon"
                    width={17}
                    height={17}
                  />
                </button>
              </Box>
              <Typography variant="body2">{item.message} </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image
                  src={notiDateTime}
                  alt="notificationIcon"
                  width={14}
                  height={14}
                />
                <Typography
                  variant="body2"
                  fontSize={"12px"}
                  sx={{ color: "#666", mt: 0.5 }}
                >
                  {new Date(item.updated_at).toLocaleString()}{" "}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationList;
