"use client";

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

// Choose URI based on environment
const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : "https://cataurant-backend-cms.onrender.com";

const httpLink = new HttpLink({ uri });

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window === "undefined") return forward(operation);

  const token = localStorage.getItem("auth_token");
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
