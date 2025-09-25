import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <div className={styles.container}>
      
        <div className={styles.rightcontainer}> 
          <div className={styles.maintext}>Contact Us:</div>
          <div className={styles.logo}> 
            <Link href="https://www.facebook.com/" target="_blank">
              <Image
                src="/facebook.png"
                alt="Facebook"
                width={30}
                height={30}
              ></Image>
            </Link>
          </div>
          <div className={styles.logo}>
            <Link href="https://www.messenger.com/" target="_blank">
              <Image
                src="/messenger.png"
                alt="Messenger"
               width={30}
                height={30}
              ></Image>
            </Link>
          </div>
          {/* <div className={styles.logo}>
            <Link href="https://www.instagram.com/" target="_blank">
              <Image
                src="/instagram.png"
                alt="Instagram"
                width={30}
                height={30}
              ></Image>
            </Link>
          </div> */}
          <div className={styles.logo}>
            <Link href="https://x.com/" target="_blank">
              <Image 
                src="/x.png" 
                alt="X" 
                width={30}
                height={30}
              ></Image>
            </Link>
          </div>
          <div className={styles.logo}>
            <Link href="https://www.youtube.com/" target="_blank" >
              <Image
                src="/youtube.png"
                alt="Youtube"
                width={30}
                height={30}
              ></Image>
            </Link>
          </div>
        </div>

        <div className={styles.midcontainer}>          
            <div className={styles.text}>
              <div className={styles.maintext}>Discover
              <div className={styles.maintext}>_______________________</div></div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              nam suscipit ut dolorum harum eveniet distinctio sit consectetur
              alias culpa possimus error porro pariatur tenetur et excepturi,
              consequatur asperiores aut
            </div>
            <div className={styles.text}>
              <div className={styles.maintext}>About
              <div className={styles.maintext}>_______________________</div></div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              nam suscipit ut dolorum harum eveniet distinctio sit consectetur
              alias culpa possimus error porro pariatur tenetur et excepturi,
              consequatur asperiores aut
            </div>
          
            <div className={styles.text}>
             <div className={styles.maintext}>Resources
              <div className={styles.maintext}>_______________________</div></div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              nam suscipit ut dolorum harum eveniet distinctio sit consectetur
              alias culpa possimus error porro pariatur tenetur et excepturi,
              consequatur asperiores aut
            </div>          
          </div>

      </div>
    </>
  );
}
