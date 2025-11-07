"use client";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

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

const GRAPHQL_URI = "http://localhost:4000/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI }),
  cache: new InMemoryCache(),
});

export const useAuthStore = (): AuthStore => {
  const [user, setUser] = useState<UserFragment | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
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
      const { data } = await client.mutate({
        mutation: RESET_PASSWORD,
        variables: { id: userId, newPassword },
      });
      if (data?.resetUserPassword?.success) {
        alert(`Password reset: ${data.resetUserPassword.message}`);
      } else {
        alert(`Failed: ${data.resetUserPassword?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return { user, token, login, logout, resetPassword, isInitialized };
};
