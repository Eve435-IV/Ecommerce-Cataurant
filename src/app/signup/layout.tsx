// src/app/signup/layout.tsx
import React from "react";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ padding: "2rem" }}>{children}</section>;
}
