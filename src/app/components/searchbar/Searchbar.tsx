import React from 'react'
import styles from "./searchbar.module.css"
import { CiSearch } from "react-icons/ci";
import Link from 'next/link';
import { CiCloud } from "react-icons/ci";
import { LuListFilter } from "react-icons/lu";
import { FaFilter } from "react-icons/fa6";

export default function Searchbar() {
  return (
    <div className={styles.searchbar}>
        <div className={styles.filter}>
            <FaFilter/>
            Filter
        </div>
        <div className={styles.searchform}>
            <CiSearch className={styles.icon}/>
            <input className={styles.search}  placeholder="Search Cathance..."/>
            <div className={styles.searchlink}>
            <Link href="/" >
            <div className={styles.searchtext}>Popular</div>
            </Link> 
            <Link href="/">
            <div className={styles.searchtext}>Spicy</div>
            </Link>  
            <Link href="/">
            <div className={styles.searchtext}>Noodles</div></Link>  
            <Link href="/" > 
            <div className={styles.searchtext}>Chicken</div></Link>    
            </div >
        </div>
        <div className={styles.recomended}>
            <LuListFilter/>
            Recommend
        </div>      
    </div>
  )
}
