"use client";
import React, { useState } from "react";
import styles from "./menu.module.css";
import { PawPrint } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Info from "../navbar/public/information.png";
import Menu1 from "../navbar/public/menu.png";
import OrderOnline from "../navbar/public/online-order.png";
import Booking from "../navbar/public/calendar.png";
import History from "../navbar/public/history.png";
import Cart from "../navbar/public/online-shopping.png";
import Profile from "../navbar/public/user (1).png";

function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* TOP POPUP (cart + profile) */}
      {open && (
        <div className={styles.topMenu}>
          <Link href="/cart" className={styles.link}>
            <img src={Cart.src} alt="Cart" className={styles.menuIcon} />
          </Link>

          <Link href="/profile" className={styles.link}>
            <img src={Profile.src} alt="Profile" className={styles.menuIcon} />
          </Link>
        </div>
      )}

      {/* BUTTON */}
      <div className={styles.mainContianer} onClick={() => setOpen(!open)}>
        <PawPrint className={`${styles.icon} ${open ? styles.rotate : ""}`} />
      </div>

      {/* RIGHT POPUP */}
      {open && (
        <div className={styles.popMenu}>
          <Link href="/components/about" className={styles.link}>
            <img src={Info.src} alt="About Us" className={styles.menuIcon} />
          </Link>

          <Link href="/components/Cuisines" className={styles.link}>
            <img src={Menu1.src} alt="Menu" className={styles.menuIcon} />
          </Link>

          <Link href="/components/orderonline" className={styles.link}>
            <img
              src={OrderOnline.src}
              alt="Order Online"
              className={styles.menuIcon}
            />
          </Link>

          <Link href="/components/booktable" className={styles.link}>
            <img
              src={Booking.src}
              alt="Book a Table"
              className={styles.menuIcon}
            />
          </Link>

          <Link href="/pages/myorders" className={styles.link}>
            <img
              src={History.src}
              alt="My Orders"
              className={styles.menuIcon}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Menu;
