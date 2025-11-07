"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import client from "../../lib/apollo-client";

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export default function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
