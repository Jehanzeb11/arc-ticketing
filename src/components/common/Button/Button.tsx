import Image from "next/image";
import React from "react";
export default function Button({
  onClick,
  text,
  style,
  type,
  icon,
  btntrasnparent,
  customIcon,
  customClass,
  btnDelete,
  libIcon,
}: any) {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`btn ${
        btntrasnparent
          ? "btn-secondray"
          : btnDelete
          ? "btn-delete"
          : "btn-primary"
      } ${customClass ? customClass : ""}`}
      style={{
        ...(icon || libIcon
          ? { paddingTop: "10px", paddingBottom: "10px" }
          : { paddingTop: "12px", paddingBottom: "12px" }),
        ...(style || {}),
      }}
    >
      {libIcon && libIcon}
      {icon && <Image src={icon} alt="icon" className="icon" />}{" "}
      {/* :white_check_mark: FIX */}
      {text || "Button"}
    </button>
  );
}
