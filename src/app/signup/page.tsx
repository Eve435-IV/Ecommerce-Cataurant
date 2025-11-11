"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../hooks/AuthStore";
import { Loader2 } from "lucide-react";
import styles from "./signup.module.css";
import {
  SignupCustomerInput,
  LoginInput,
  SignupResponse,
  LoginResponse,
} from "../schema/users";

// =======================
// GraphQL Mutations
// =======================
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
        profileImage
        isActive
        createdAt
      }
    }
  }
`;

const LOGIN_CUSTOMER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        firstName
        lastName
        email
        role
        profileImage
        isActive
        createdAt
      }
    }
  }
`;

// =======================
// Component
// =======================
export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<SignupCustomerInput & LoginInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  // =======================
  // Mutations
  // =======================
  const [signupMutation, { loading: signupLoading }] = useMutation<
    SignupResponse,
    { input: SignupCustomerInput }
  >(SIGNUP_CUSTOMER, {
    onCompleted: ({ signupCustomer }) => {
      login(signupCustomer.user, signupCustomer.token);
      setFeedback("Signup successful! Redirecting...");
      setTimeout(() => router.replace("/profile"), 1000);
    },
    onError: (err) => setFeedback(err.message),
  });

  const [loginMutation, { loading: loginLoading }] = useMutation<
    LoginResponse,
    { input: LoginInput }
  >(LOGIN_CUSTOMER, {
    onCompleted: ({ login: loginData }) => {
      login(loginData.user, loginData.token);
      setFeedback("Login successful! Redirecting...");
      setTimeout(() => router.replace("/profile"), 500);
    },
    onError: (err) => setFeedback(err.message),
  });

  // =======================
  // Handlers
  // =======================
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (isLogin) {
      await loginMutation({
        variables: {
          input: { email: formData.email, password: formData.password },
        },
      });
    } else {
      await signupMutation({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
        },
      });
    }
  };

  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-card"]}>
        <div className={styles["auth-header"]}>
          {isLogin ? "Login to Your Account" : "Create Account"}
        </div>

        <div className={styles["toggle-buttons-wrapper"]}>
          <button
            type="button"
            className={`${styles["toggle-button"]} ${
              isLogin ? "active" : "inactive"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles["toggle-button"]} ${
              !isLogin ? "active" : "inactive"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {feedback && (
          <div
            className={`${styles["message-box"]} ${
              feedback.toLowerCase().includes("success")
                ? styles["success-message"]
                : styles["error-message"]
            }`}
          >
            {feedback}
          </div>
        )}

        <form className={styles["auth-form"]} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles["input-group"]}>
              <input
                className={styles["auth-input"]}
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                className={styles["auth-input"]}
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          )}

          <input
            className={styles["auth-input"]}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className={styles["auth-input"]}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className={styles["main-auth-button"]}
            disabled={signupLoading || loginLoading}
          >
            {signupLoading || loginLoading ? (
              <Loader2 className="spin" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
