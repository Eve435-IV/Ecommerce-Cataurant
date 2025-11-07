"use client";

import React from "react";

interface ActionProps {
  onOpen: () => void;
}

export default function Action({ onOpen }: ActionProps) {
  return (
    <button
      onClick={onOpen}
      style={{
        padding: "8px 15px 8px",
        margin: "8px 15px 8px",
        backgroundColor: "#E44D26",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Order
    </button>
  );
}
