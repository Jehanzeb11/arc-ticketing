import { Container } from "@mui/material";
import React from "react";

export default function DefaultLayout({ children }: any) {
  return (
    <main>
      <Container
        sx={{
          padding: "0px",
          maxWidth: "100% !important",
          paddingLeft: "40px !important",
          paddingRight: "40px !important",
        }}
      >
        {children}
      </Container>
    </main>
  );
}
