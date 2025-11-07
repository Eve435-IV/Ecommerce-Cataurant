import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.leftBranding}>
        <Link href="/" className={styles.logoTitle}>
          Cātaurant
        </Link>
        <p className={styles.tagline}>
          Taste the world, delivered to your table.
        </p>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Cātaurant. All rights reserved.
        </p>
      </div>
      <div className={styles.midcontainer}>
        <div className={styles.linkColumn}>
          <div className={styles.maintext}>Discover</div>
          <Link href="/components/Cuisines" className={styles.linkItem}>
            Menu
          </Link>
          <Link href="/orderonline" className={styles.linkItem}>
            Order Online
          </Link>
          <Link href="/findjob" className={styles.linkItem}>
            Book a Table
          </Link>
          <Link href="/ourlocation" className={styles.linkItem}>
            Our Locations
          </Link>
        </div>

        <div className={styles.linkColumn}>
          <div className={styles.maintext}>About</div>
          <Link href="/components/about" className={styles.linkItem}>
            Our Story
          </Link>
          <Link href="/careers" className={styles.linkItem}>
            Careers
          </Link>
          <Link href="/team" className={styles.linkItem}>
            Meet the Team
          </Link>
          <Link href="/press" className={styles.linkItem}>
            Press & Media
          </Link>
        </div>

        <div className={styles.linkColumn}>
          <div className={styles.maintext}>Contact</div>
          <Link href="/faq" className={styles.linkItem}>
            FAQ
          </Link>
          <Link href="/policy" className={styles.linkItem}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.linkItem}>
            Terms of Service
          </Link>
          <Link href="/contactus" className={styles.linkItem}>
            Customer Support
          </Link>
        </div>
      </div>
      <div className={styles.rightcontainer}>
        <div className={styles.maintext}>Connect With Us</div>
        <div className={styles.socialIcons}>
          <Link
            href="https://www.facebook.com/"
            target="_blank"
            className={styles.socialLink}
          >
            <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
          </Link>
          <Link
            href="https://x.com/"
            target="_blank"
            className={styles.socialLink}
          >
            <Image src="/x.png" alt="X (Twitter)" width={24} height={24} />
          </Link>
          <Link
            href="https://www.youtube.com/"
            target="_blank"
            className={styles.socialLink}
          >
            <Image src="/youtube.png" alt="Youtube" width={24} height={24} />
          </Link>
          <Link
            href="https://www.messenger.com/"
            target="_blank"
            className={styles.socialLink}
          >
            <Image
              src="/messenger.png"
              alt="Messenger"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
