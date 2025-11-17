"use client";

import React from "react";
import styles from "../profile/profile.module.css";

type AuthFormProps = {
  children?: React.ReactNode;
};

export default function AuthForm({ children }: AuthFormProps) {
  return (
    <div className={styles.authFormContainer}>
      {children}

      <h2 className={styles.title}>Sign In / Sign Up</h2>
      <form className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
        />
        <button type="submit" className={styles.submitButton}>
          Continue
        </button>
      </form>
    </div>
  );
}
