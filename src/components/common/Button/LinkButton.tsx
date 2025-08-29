import Link from "next/link";
import React from "react";

export default function LinkButton({href , text , style} :any) {
  const myStyle = {
    background: "var(--pri-color)",
    color: "white",
    borderRadius: "30px",
    border: "none",
    padding: "8px 20px",
    textDecoration: "none",
    textTransform: "capitalize",
    fontSize : "14px"
  };
  return (
    <Link href={href || "#"} style={{...myStyle , ...style}}>
      {text || "text"}
    </Link>
  );
}
