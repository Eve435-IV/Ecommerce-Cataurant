"use client";

import React from "react";
import styles from "./searchbar.module.css";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { LuListFilter } from "react-icons/lu";
import { FaFilter } from "react-icons/fa6";

export default function Searchbar({
  onToggle,
}: {
  onToggle: (open: boolean) => void;
}) {
  const handleToggle = () => {
    onToggle(true);
  };

  return (
    <div className={styles.root}>
      <div className={styles.searchbar}>
        <button className={styles.filter} onClick={handleToggle}>
          <FaFilter className={styles.filterIcon} />
          <span className={styles.filterText}>Filter</span>
        </button>
        <div className={styles.searchform}>
          <CiSearch className={styles.icon} />
          <input className={styles.search} placeholder="Search Cataurant..." />
          <div className={styles.searchlink}>
            <Link href="/" passHref>
              <div className={styles.searchtext}>Popular</div>
            </Link>
            <Link href="/" passHref>
              <div className={styles.searchtext}>Spicy</div>
            </Link>
            <Link href="/" passHref>
              <div className={styles.searchtext}>Noodles</div>
            </Link>
            <Link href="/" passHref>
              <div className={styles.searchtext}>Chicken</div>
            </Link>
          </div>
        </div>
        <button className={styles.recomended}>
          <LuListFilter className={styles.recomendedIcon} />
          <span className={styles.recomendedText}>Recommend</span>
        </button>
      </div>
    </div>
  );
}
