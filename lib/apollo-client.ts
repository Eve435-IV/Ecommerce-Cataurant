"use client";

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

// Choose URI based on environment
// console.log(process.env.NODE_ENV,"process.env.NODE_ENV")

// const uri =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:4000/graphql"
//     : "https://cataurant-backend-cms.onrender.com";

  //  const uri = 
    // "https://cataurant-backend-cms.onrender.com";

// const uri = process.env.NEXT_PUBLIC_GRAPHQL_URI;

//Development
// const uri = "http://localhost:4000/graphql"

//Production
const uri = "https://cataurant-backend-cms.onrender.com"


const httpLink = new HttpLink({ uri });

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window === "undefined") return forward(operation);

  const token = localStorage.getItem("auth_token");
  console.log(token,"token")
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
