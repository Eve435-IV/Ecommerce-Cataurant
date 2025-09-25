"use client";

import React, { useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GrMapLocation } from "react-icons/gr";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaSignInAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import Image from "next/image";
import Cambodiaflag from "./public/cambodia.png";
import SouthKoreaflag from "./public/south-korea.png";
import JapanFlag from "./public/japan.png";
import Fastfood from "./public/fast-food.png";
import Info from "./public/information.png";
import Menu1 from "./public/menu.png";
import OrderOnline from "./public/online-store.png";
import Booking from "./public/table.png";
import SignIn from "./public/signin.png";

const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit"
    >
      <a href={href} className="relative text-white">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-16"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const About = () => {
  return (
    <>
      <div className={styles.dropdown}>
        <Link href="/components/about" className={styles.text}>
          <FaUsers className={styles.icons} />
          About Us
        </Link>
        <Link href="/components/contactus" className={styles.text}>
          <MdContactPhone className={styles.icons} />
          Contact Us
        </Link>
        <Link href="/components/emailus" className={styles.text}>
          <MdContactMail className={styles.icons} />
          Our Email
        </Link>
        <Link href="/components/ourlocation" className={styles.text}>
          <GrMapLocation className={styles.icons} />
          Our Location
        </Link>
      </div>
    </>
  );
};

const Menu = () => {
  return (
    <div className={styles.dropdown}>
      <Link href="/components/cuisines/cambodiaCuisine" className={styles.text}>
        <Image src={Cambodiaflag} alt="Cambodia Flag" className={styles.image} />
        Cambodia's Cruisine
      </Link>
      <Link href="/components/cuisines/southkoreaCuisine" className={styles.text}>
        <Image src={SouthKoreaflag} alt="South Korea Flag" className={styles.image} />
        Korean's Cruisine
      </Link>
      <Link href="/components/cuisines/japaneseCuisine" className={styles.text}>
        <Image src={JapanFlag} alt="Japan Flag" className={styles.image} />
        Japan's Cruisine
      </Link>

      <Link href="/components/cuisines/fastFood" className={styles.text}>
        <Image src={Fastfood} alt="Fast Food logo" className={styles.image} />
        Fast Food
      </Link>
    </div>
  );
};

export default function Navbar() {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.leftcontainer}>
          <Link href="/" className={styles.mainlogo}>
            Cātaurant
          </Link>
        </div>

        <div className={styles.midcontainer}>
          <div className={styles.dropdowns}>
           
            <FlyoutLink href="#" FlyoutContent={About}>
              <p className={styles.link}>
                <Image src={Info} alt="Info" className={styles.icon} />
                  About
              </p>
            </FlyoutLink>
          </div>
          <div className={styles.dropdowns}>
            <FlyoutLink href="/components/menu" FlyoutContent={Menu}>
              <p className={styles.link}>
                <Image src={Menu1} alt="Menu" className={styles.icon} />
                Menu</p>
            </FlyoutLink>
          </div>
          <Link href="/orderonline" className={styles.link}>
          <Image src={OrderOnline} alt="Order Online" className={styles.icon} />
            Order Online
          </Link>
          <Link href="/findjob" className={styles.link}>
          <Image src={Booking} alt="Booking" className={styles.icon} />
            Book a Table
          </Link>
        </div>

        <div className={styles.rightcontainer}>
          <Link href="/home" className={styles.logo}>
            <RiShoppingCart2Line />
          </Link>
          <Link href="/components/signin" className={styles.logo}>
          <FaSignInAlt />
          </Link>
        </div>
      </nav>
    </>
  );
}
