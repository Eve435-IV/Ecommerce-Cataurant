"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/client/react";
import { useAuthStore, AuthStore } from "../../hooks/AuthStore";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import styles from "./login.module.css";

const GRAPHQL_URI = "http://localhost:4000/graphql";

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI }),
  cache: new InMemoryCache(),
});

const SIGNUP_CUSTOMER = gql`
  mutation SignupCustomer($input: SignupCustomerInput!) {
    signupCustomer(input: $input) {
      token
      user {
        _id
        firstName
        lastName
        email
        role
        isActive
        profileImage
      }
    }
  }
`;

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        firstName
        lastName
        email
        role
        isActive
        profileImage
      }
    }
  }
`;

interface AuthFormData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

function AuthForm() {
  const {
    login,
    resetPassword,
    user: currentUser,
  } = useAuthStore() as AuthStore;
  const router = useRouter();

  const [action, setAction] = useState<"Login" | "Sign Up">("Login");
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetUserId, setResetUserId] = useState<string>("");

  const [signupMutation] = useMutation(SIGNUP_CUSTOMER, {
    onCompleted: ({ signupCustomer }) => {
      login(signupCustomer.user, signupCustomer.token);
      setTimeout(() => window.location.reload(), 300);
      router.replace("/profile");
    },
    onError: (err) => {
      setMessage(err.message.replace("GraphQL error: ", ""));
      setIsProcessing(false);
    },
  });

  const [loginMutation] = useMutation(LOGIN_USER, {
    onCompleted: ({ login: loginData }) => {
      login(loginData.user, loginData.token);
      setTimeout(() => window.location.reload(), 300);
      router.replace("/profile");
    },
    onError: (err) => {
      setMessage(err.message.replace("GraphQL error: ", ""));
      setIsProcessing(false);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage("Email & password required");
      return false;
    }
    if (action === "Sign Up" && (!formData.firstName || !formData.lastName)) {
      setMessage("Full name required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsProcessing(true);
    if (!validateForm()) {
      setIsProcessing(false);
      return;
    }
    try {
      if (action === "Sign Up") {
        await signupMutation({ variables: { input: formData } });
      } else {
        await loginMutation({
          variables: {
            input: { email: formData.email, password: formData.password },
          },
        });
      }
    } catch {
      setMessage("Unexpected error");
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUserId) {
      alert("Please enter the user ID to reset password.");
      return;
    }
    setIsProcessing(true);
    await resetPassword(resetUserId, "NewSecurePassword123!");
    setIsProcessing(false);
    setResetUserId("");
  };

  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-card"]}>
        <h2 className={styles["auth-header"]}>{action}</h2>

        <form onSubmit={handleSubmit} className={styles["auth-form"]}>
          {action === "Sign Up" && (
            <div className={styles["input-group"]}>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={styles["auth-input"]}
                disabled={isProcessing}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={styles["auth-input"]}
                disabled={isProcessing}
                required
              />
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles["auth-input"]}
            disabled={isProcessing}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles["auth-input"]}
            disabled={isProcessing}
            required
          />

          {message && (
            <div
              className={`${styles["message-box"]} ${styles["error-message"]}`}
            >
              <AlertTriangle className={styles["message-icon"]} /> {message}
            </div>
          )}

          <button
            type="submit"
            className={styles["main-auth-button"]}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className={styles.spin} /> : action}
          </button>
        </form>

        <div className={styles["toggle-buttons-wrapper"]}>
          <button
            type="button"
            className={`${styles["toggle-button"]} ${
              action === "Login" ? styles["active-toggle"] : ""
            }`}
            onClick={() => {
              setAction("Login");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles["toggle-button"]} ${
              action === "Sign Up" ? styles["active-toggle"] : ""
            }`}
            onClick={() => {
              setAction("Sign Up");
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        {currentUser?.role === "ADMIN" && (
          <div style={{ marginTop: "20px" }}>
            <h3>Reset User Password (Admin)</h3>
            <input
              placeholder="Enter User ID"
              value={resetUserId}
              onChange={(e) => setResetUserId(e.target.value)}
              className={styles["auth-input"]}
              disabled={isProcessing}
            />
            <button
              onClick={handleResetPassword}
              className={styles["main-auth-button"]}
              disabled={isProcessing}
              style={{ marginTop: "10px" }}
            >
              {isProcessing ? (
                <Loader2 className={styles.spin} />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <ApolloProvider client={client}>
      <AuthForm />
    </ApolloProvider>
  );
}
