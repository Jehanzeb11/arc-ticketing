import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cardBg1 from "@/assets/images/tickets/small-cards/ticket-card1.png";
import cardBg2 from "@/assets/images/tickets/small-cards/ticket-card2.png";
import cardBg3 from "@/assets/images/tickets/small-cards/ticket-card3.png";
import cardBg4 from "@/assets/images/tickets/small-cards/ticket-card4.png";
import cardBg5 from "@/assets/images/tickets/small-cards/ticket-card5.png";
import cardBg6 from "@/assets/images/tickets/small-cards/ticket-card6.png";
import cardBg7 from "@/assets/images/tickets/small-cards/ticket-card7.png";
import cardBg8 from "@/assets/images/tickets/small-cards/ticket-card8.png";
export default function TicketsCards() {
  const cards = [
    {
      img: cardBg1,
      title: "Total Tickets",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg2,
      title: "Open Tickets",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg3,
      title: "In Progress",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg4,
      title: "Resolved",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg5,
      title: "Cancelled",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },

    {
      img: cardBg6,
      title: "High/Urgent",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg7,
      title: "Avg Response",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
    {
      img: cardBg8,
      title: "Eight Card",
      value: "25",
      percent: "4.6%",
      vs: "vs yestarday",
    },
  ];
  return (
    <Grid
      container
      sx={{
        py: 3,
        px: 4,
        gap: 1.8,
        backgroundColor: "#E9EAF9",
        mt: 4,
        borderRadius: "20px !important",
      }}
    >
      {cards.map((card, index) => (
        <Grid size={{ lg: 2.9, xs: 2.9 }} key={index}>
          <Card
            sx={{
              background: `white`,
              boxShadow: "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: "22px 20px !important",
              }}
            >
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <img src={card.img.src} alt="" />
                <Box>
                  <Typography
                    variant="h6"
                    fontSize={15}
                    fontWeight={500}
                    color="#3e3e3e7c"
                    mb={0.5}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontSize={30}
                    fontWeight={600}
                    color="#3E3E3E"
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                  flexDirection: "column",
                }}
              >
                <Typography
                  display={"flex"}
                  alignItems={"center"}
                  fontSize={14}
                  fontWeight={500}
                  color="#0FA373"
                >
                  <ExpandLessIcon /> {card.percent}
                </Typography>
                <Typography ml={3} fontSize={15} fontWeight={500}>
                  {card.vs}
                </Typography>

                <Typography
                  color="#2D83C3"
                  ml={3}
                  fontSize={15}
                  fontWeight={500}
                >
                  2m 32s
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {/* <Grid size={{ lg: 1.6, xs: 12 }}>
        <Card
          sx={{
            background: `url(${cardBg1.src})`,
            boxShadow: 'none',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <CardContent>
            <Typography variant='h6'>Total Tickets</Typography>
            <Typography variant='h4'>25</Typography>
            <Typography>
              <ExpandLessIcon /> 4.6%
            </Typography>
            <Typography>vs yestarday</Typography>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
}
