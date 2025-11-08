"use client";

import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

export type RoleType = "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | "GUEST";

export interface UserFragment {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  profileImage?: string;
  createdAt?: string;
}

export interface AuthStore {
  user: UserFragment | null;
  token: string | null;
  login: (userData: UserFragment, authToken: string) => void;
  logout: () => void;
  resetPassword: (userId: string, newPassword: string) => Promise<void>;
  isInitialized: boolean;
}

// const GRAPHQL_URI =
//   process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:4000/graphql";


// const apolloClient = new ApolloClient({
//   link: new HttpLink({ uri:  process.env.NEXT_PUBLIC_GRAPHQL_URI }),
//   cache: new InMemoryCache(),
// });
const apolloClient = new ApolloClient({
  link: new HttpLink({ uri:  process.env.MONGO_DB ||process.env.NEXT_PUBLIC_GRAPHQL_URI }),
  cache: new InMemoryCache(),
});


export const useAuthStore = (): AuthStore => {
  const [user, setUser] = useState<UserFragment | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        console.warn("Invalid auth data, clearing storage.");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }

    setIsInitialized(true);
  }, []);

  const login = (userData: UserFragment, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const RESET_PASSWORD = gql`
    mutation ResetUserPassword($id: ID!, $newPassword: String!) {
      resetUserPassword(_id: $id, newPassword: $newPassword) {
        success
        message
        khMessage
      }
    }
  `;

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      interface ResetPasswordResult {
        resetUserPassword: {
          success: boolean;
          message?: string;
          khMessage?: string;
        };
      }

      const { data } = await apolloClient.mutate<ResetPasswordResult>({
        mutation: RESET_PASSWORD,
        variables: { id: userId, newPassword },
      });

      const result = data?.resetUserPassword;

      if (result?.success) {
        alert(`${result.message || "Password reset successfully"}`);
      } else {
        alert(`${result?.message || "Password reset failed"}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return { user, token, login, logout, resetPassword, isInitialized };
};
