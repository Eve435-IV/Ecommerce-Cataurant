"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../hooks/AuthStore";
import { Loader2 } from "lucide-react";
import styles from "./login.module.css";
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
        phoneNumber
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

  // ✅ Properly typed mutation
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
    <div className={styles.signupContainer}>
      <h2>Create Account</h2>

      {feedback && <div className={styles.feedbackMessage}>{feedback}</div>}

      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className={styles.signupButton}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </button>
      </form>

      {error && <div className={styles.errorMessage}>{error.message}</div>}
    </div>
  );
}
