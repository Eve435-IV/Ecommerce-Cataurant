"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../hooks/AuthStore";
import { Loader2 } from "lucide-react";
import styles from "./signup.module.css";
import { SignupCustomerInput, SignupResponse } from "../schema/users";

// =======================
// GraphQL Mutation
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
        # phoneNumber
        role
        isActive
      }
    }
  }
`;

// =======================
// Component
// =======================
export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState<SignupCustomerInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const [signupMutation, { loading, error }] = useMutation<
    SignupResponse,
    { input: SignupCustomerInput }
  >(SIGNUP_CUSTOMER, {
    onCompleted: ({ signupCustomer }) => {
      login(signupCustomer.user, signupCustomer.token);
      setFeedback("Signup successful! Redirecting...");
      setTimeout(() => router.replace("/profile"), 1000);
    },
    onError: (err) => {
      setFeedback(err.message || "Signup failed. Please try again.");
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    await signupMutation({ variables: { input: formData } });
  };

  return (
    <div className={styles["auth-wrapper"]}>
      <div className={styles["auth-card"]}>
        <div className={styles["auth-header"]}>Create Account</div>

        {feedback && (
          <div
            className={`${styles["message-box"]} ${
              feedback.includes("success")
                ? styles["success-message"]
                : styles["error-message"]
            }`}
          >
            <p>{feedback}</p>
          </div>
        )}

        {error && (
          <div
            className={`${styles["message-box"]} ${styles["error-message"]}`}
          >
            <p>{error.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles["auth-form"]}>
          <div className={styles["input-group"]}>
            <div className={styles["field-wrapper"]}>
              <label className={styles["input-label"]}>First Name</label>
              <input
                name="firstName"
                type="text"
                className={styles["auth-input"]}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles["field-wrapper"]}>
              <label className={styles["input-label"]}>Last Name</label>
              <input
                name="lastName"
                type="text"
                className={styles["auth-input"]}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles["field-wrapper"]}>
            <label className={styles["input-label"]}>Email</label>
            <input
              name="email"
              type="email"
              className={styles["auth-input"]}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["field-wrapper"]}>
            <label className={styles["input-label"]}>Password</label>
            <input
              name="password"
              type="password"
              className={styles["auth-input"]}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={styles["main-auth-button"]}
            disabled={loading}
          >
            {loading ? <Loader2 className={styles["spin"]} /> : "Sign Up"}
          </button>
        </form>

        <div className={styles["toggle-buttons-wrapper"]}>
          <button
            className={`${styles["toggle-button"]} ${styles["inactive"]}`}
            onClick={() => router.push("/login")}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
