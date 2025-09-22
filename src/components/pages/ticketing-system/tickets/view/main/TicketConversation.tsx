"use client";
import React from "react";
import profileImg from "@/assets/images/profile/small-profile.png";

import { Box, Typography, Avatar, Chip, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Image from "next/image";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import calenderIcon from "@/assets/icons/unibox/ticket/viewpage/calender.svg";
import replyIcon from "@/assets/icons/unibox/ticket/viewpage/ticket.svg";
import { imageUrl, imageUrlTicket } from "@/lib/constants/variables";

const TicketConversation = ({ conversationData, ticketData }: any) => {
  return (
    <Box
      sx={{
        p: 2.5,
        backgroundColor: "#fff",
        borderRadius: "10px",
        filter: "drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))",
      }}
    >
      {/* Ticket Header */}
      <Box
        sx={{
          p: 1.5,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src={replyIcon} alt="icon" style={{ marginRight: "10px" }} />
          <Box>
            <Typography
              sx={{ fontSize: "23px", fontWeight: "600", color: "#000" }}
            >
              {ticketData?.subject}
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "16px" }}>
              Requested by {ticketData?.customer_name} •{" "}
              {new Date(ticketData?.created_at).toLocaleString()} • Assigned to
              <span
                style={{
                  color: "var(--pri-color)",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
              >
                {" "}
                {ticketData?.creator?.full_name}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={ticketData?.type}
            sx={{
              color: "var(-pri-color)",
              background: "transparent",
              borderRadius: "100px",
              border: "1px solid var(--border-color)",
            }}
          />
          <Chip
            label={ticketData?.priority}
            sx={{
              borderRadius: "100px",
              backgroundColor: "var(--pri-light-color)",
              color: "var(-pri-color)",
            }}
          />
        </Box>
      </Box>

      {/* Conversation Messages */}
      {conversationData?.map((message) => (
        <Box
          key={message.id}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            p: 1.5,
            mb: 1.5,
            display: "flex",
            alignItems: "flex-start",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Avatar
            alt={message.name}
            src={profileImg.src}
            sx={{ width: 40, height: 40, mr: 1.5 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "500", color: "#333" }}
            >
              {message?.creator?.full_name}{" "}
              <span style={{ fontSize: "14px", color: "#666" }}>
                {message?.creator?.email}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#565656", mt: 0.5 }}>
              {message.message}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 0.5,
                flexWrap: "wrap",
              }}
            >
              {message?.attachments?.length > 0 &&
                message?.attachments?.map((attachment, index) => (
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    sx={{
                      m: 1,
                      borderColor: "var(--border-color)",
                      color: "var(--pri-color)",
                      textTransform: "none",
                      borderRadius: "3px",
                      border: "1px solid var(--border-color)",
                      background: "var(--pri-light-color)",
                    }}
                    onClick={async () => {
                      // download file from server as binary
                      const fileUrl = imageUrlTicket + attachment.filename;

                      try {
                        const res = await fetch(fileUrl);
                        if (!res.ok)
                          throw new Error(`Failed to fetch: ${res.status}`);
                        const blob = await res.blob();

                        // create a temporary object URL and trigger download
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = attachment.filename;
                        document.body.appendChild(a);
                        a.click();
                        // cleanup
                        window.URL.revokeObjectURL(url);
                        a.remove();
                      } catch (err) {
                        // fallback: open the file URL in a new tab
                        console.error(
                          "Download failed, opening in new tab:",
                          err
                        );
                        window.open(fileUrl, "_blank");
                      }
                    }}
                  >
                    {attachment.filename.slice(0, 14)}{" "}
                    <FileDownloadIcon
                      sx={{ color: "var(--pri-color)", ml: 1 }}
                    />
                  </Button>
                ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <Image
              src={calenderIcon}
              alt="icon"
              style={{ marginRight: "10px" }}
            />
            <Typography variant="caption" sx={{ color: "#666" }}>
              {new Date(message.updated_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TicketConversation;
