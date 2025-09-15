"use client";
import { Box, Grid, List, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import icon1 from "@/assets/icons/unibox/top-tabs/icon1.svg";
import icon2 from "@/assets/icons/unibox/top-tabs/icon2.svg";
import icon3 from "@/assets/icons/unibox/top-tabs/icon3.svg";
import icon4 from "@/assets/icons/unibox/top-tabs/icon4.svg";
import { usePathname } from "next/navigation";
import Search from "@/components/common/search";
import Button from "@/components/common/Button/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import archiveIcon from "@/assets/icons/unibox/ticket/listpage/archive.svg";
import { usePermission } from "@/hooks/usePermission";
export default function TicketHeader({
  searchQuery,
  handleSearch,
  onClickAddTicket,
  onClickArchive,
  archive,
  isdelete,
}: any) {
    const canFilterTickets = usePermission("Search & Filter Tickets");
    const canCreateTickets = usePermission("Create Ticket");
  
  return (
    <Grid
      container
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        py: "26px",
      }}
    >
      <Grid size={{ lg: 3, xs: 12 }}>
        <Typography variant="h4" sx={{ fontWeight: "600", fontSize: "30px" }}>
          {isdelete
            ? "Deleted Tickets"
            : !archive
            ? "Tickets Overview"
            : "Archive Tickets"}
        </Typography>
      </Grid>
      <Grid size={{ lg: 6, xs: 12 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            {canFilterTickets && <Search searchQuery={searchQuery} handleSearch={handleSearch} />}
          </Box>
          {!archive && !isdelete && (
            <Box>
              <Box
                sx={{ display: "flex", gap: "10px" }}
                className="ticket-button"
              >
                {canCreateTickets && <Button
                  text="Add Ticket"
                  onClick={onClickAddTicket}
                  libIcon={<AddCircleIcon />}
                />}

                {/* <Button
                  btntrasnparent
                  text='Archive'
                  onClick={onClickArchive}
                  icon={archiveIcon}
                /> */}
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
