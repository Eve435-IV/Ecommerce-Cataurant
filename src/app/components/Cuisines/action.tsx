"use client";

import React from "react";
import styles from "./cuisine.module.css";

interface ActionProps {
  onOpen: () => void;
}

export default function Action({ onOpen }: ActionProps) {
  return (
    <button className={styles.orderButton} onClick={onOpen}>
      Order
    </button>
  );
}
