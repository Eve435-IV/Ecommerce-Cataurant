"use client";

import React, { useState } from "react";
import {
  Loader2,
  Lock,
  CalendarDays,
  CheckCircle2,
  Utensils,
} from "lucide-react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { useAuthStore, AuthStore } from "../../../hooks/AuthStore";
import AuthForm from "../../signup/layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./booktable.module.css";

// const GRAPHQL_URI = "http://localhost:4000/graphql";
const GRAPHQL_URI = "https://cataurant-backend-cms.onrender.com";
const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI }),
  cache: new InMemoryCache(),
});

export default function BookATable() {
  const { user, isInitialized } = useAuthStore() as AuthStore;

  if (!isInitialized) {
    return (
      <div className={styles.loadingWrapper}>
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
  <div className={styles.promptWrapper}>
    <div className={styles.promptCard}>
      <Lock className={styles.lockIcon} />
      <h1 className={styles.promptTitle}>Book a Table</h1>
      <p className={styles.promptMessage}>
        You must be logged in to reserve a table.
      </p>
      <p className={styles.promptAction}>Please Sign Up or Log In below.</p>
    </div>
    {/* <div className={styles.authBox}>
      <AuthForm />
    </div> */}
  </div>
);

const BookTableForm = () => {
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
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
    }, 1200);
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <Utensils className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>Reserve Your Table</h2>
        <p className={styles.headerSubtitle}>
          Choose your cuisine and preferred time — we'll get everything ready.
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Cuisine */}
        <div className={styles.field}>
          <label className={styles.label}>Cuisine Type</label>
          <select
            className={styles.select}
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            required
          >
            <option value="">Select a Cuisine</option>
            <option value="KOREAN">Korean</option>
            <option value="JAPANESE">Japanese</option>
            <option value="CAMBODIAN">Cambodian</option>
            <option value="FAST_FOOD">Fast Food</option>
          </select>
        </div>

        {/* Date & Time Picker */}
        <div className={styles.field}>
          <label className={styles.label}>Date & Time</label>
          <DatePicker
            selected={dateTime}
            onChange={(date) => setDateTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className={styles.input}
            required
          />
        </div>

        {/* Guests */}
        <div className={styles.field}>
          <label className={styles.label}>Number of Guests</label>
          <input
            type="number"
            min={1}
            max={10}
            className={styles.input}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
          />
        </div>
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
          <p>Table successfully booked!</p>
        </div>
      )}
    </form>
  );
};
