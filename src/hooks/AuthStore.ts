"use client";

import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

// ==========================
// Interfaces
// ==========================
export interface UserFragment {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER" | "GUEST";
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

// ==========================
// Apollo Client Setup
// ==========================
const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:4000/graphql";

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI }),
  cache: new InMemoryCache(),
});

// ==========================
// Custom Hook
// ==========================
export const useAuthStore = (): AuthStore => {
  const [user, setUser] = useState<UserFragment | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // ✅ Initialize from localStorage (runs once)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

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

  // ✅ Login function
  const login = (userData: UserFragment, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  // ✅ Password Reset Mutation
  const RESET_PASSWORD = gql`
    mutation ResetUserPassword($id: ID!, $newPassword: String!) {
      resetUserPassword(_id: $id, newPassword: $newPassword) {
        success
        message
        khMessage
      }
    }
  `;

  // ✅ resetPassword function
  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: RESET_PASSWORD,
        variables: { id: userId, newPassword },
      });

      const result = data?.resetUserPassword;

      if (result?.success) {
        alert(`✅ ${result.message || "Password reset successfully"}`);
      } else {
        alert(`❌ ${result?.message || "Password reset failed"}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return { user, token, login, logout, resetPassword, isInitialized };
};
