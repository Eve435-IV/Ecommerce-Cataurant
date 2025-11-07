"use client";

import React, { useState } from "react";
import { Loader2, Lock, CalendarDays, CheckCircle2 } from "lucide-react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useAuthStore, AuthStore } from "../../../hooks/AuthStore";
import { AuthForm } from "../../signup/layout";
import styles from "./booktable.module.css";

const GRAPHQL_URI = "http://localhost:4000/graphql";

const httpLink = new HttpLink({ uri: GRAPHQL_URI });
const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

export default function BookATable() {
  const { user, isInitialized } = useAuthStore() as AuthStore;

  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingIcon} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <div className={styles.pageContainer}>
        {user ? <BookTableForm /> : <LoginPrompt />}
      </div>
    </ApolloProvider>
  );
}

const LoginPrompt = () => (
  <div className={styles.promptContainer}>
    <div className={styles.promptCard}>
      <Lock className={styles.lockIcon} />
      <h1 className={styles.promptTitle}>Book a Table</h1>
      <p className={styles.promptMessage}>
        You must be logged in to reserve a table.
      </p>
      <p className={styles.promptAction}>Please Sign Up or Log In below.</p>
    </div>

    <AuthForm />
  </div>
);

const BookTableForm = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <CalendarDays className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>Reserve Your Table.</h2>
        <p className={styles.headerSubtitle}>
          Choose your favorite cuisine and time — we’ll get it ready for you.
        </p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Cuisine Type</label>
        <select
          className={styles.select}
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          required
        >
          <option value="">Select a Table Type</option>
          <option value="KOREAN">Korean Table</option>
          <option value="JAPANESE">Japanese Table</option>
          <option value="CAMBODIAN">Cambodian Table</option>
          <option value="FAST_FOOD">Fast Food Table</option>
        </select>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Time</label>
          <input
            type="time"
            className={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Number of Guests</label>
        <input
          type="number"
          min="1"
          max="10"
          className={styles.input}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className={`${styles.iconSmall} ${styles.spin}`} />
            Booking...
          </>
        ) : (
          "Book Table"
        )}
      </button>

      {success && (
        <div className={styles.successBox}>
          <CheckCircle2 className={styles.successIcon} />
          <p>Table successfully booked! </p>
        </div>
      )}
    </form>
  );
};
