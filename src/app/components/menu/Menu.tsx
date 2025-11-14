"use client";
import React, { useState } from "react";
import styles from "./menu.module.css";
import { PawPrint } from "lucide-react";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Button */}
      <div className={styles.mainContianer} onClick={() => setOpen(!open)}>
        <PawPrint className={`${styles.icon} ${open ? styles.rotate : ""}`} />
      </div>

      {/* Pop-out menu */}
      {open && (
        <div className={styles.popMenu}>
          <a href="/home">Home</a>
          <a href="/menu">Menu</a>
          <a href="/orders">Orders</a>
        </div>
      )}
    </div>
  );
}

export default Menu;
