import React from 'react'
import styles from "./menu.module.css"
import Link from "next/link";
import Image from 'next/image'
import JapanBanner from "./public/ramen.png"
import SoeulBanner from "./public/tteok.png"
import Angkorwatcover from "./public/food.png"
import FastFoodBanner from "./public/fastfood.png"



export default function Menu() {
  return (
    <>
    <div className={styles.container}>    
      <Link href="/components/cuisines/cambodiaCuisine">  
        <button className={styles.cambodiaBanner}>
          <div className={styles.logo}>
            <Image className={styles.image}src={Angkorwatcover} alt="Angkor Wat Banner" />
          </div>
          <div className={styles.text}>Cambodia Cuisine</div>
        </button>
      </Link>
      <Link href="/components/cuisines/southkoreaCuisine">  
        <button className={styles.southkoreaBanner}>
          <div className={styles.logo}>
          <Image className={styles.image}src={SoeulBanner} alt="Angkor Wat Banner" />
          </div>
          <div className={styles.text}>SouthKorea Cuisine</div>
        </button>
      </Link>
      <Link href="/components/cuisines/japaneseCuisine">  
        <button className={styles.japaneseBanner}>
          <div className={styles.logo}>
          <Image className={styles.image}src={JapanBanner} alt="Angkor Wat Banner" />
          </div>
          <div className={styles.text}>Japanese Cuisine</div>
        </button>
      </Link>
      <Link href="/components/cuisines/fastFood">  
        <button className={styles.fastfoodBanner}>
          <div className={styles.logo}>
          <Image className={styles.image}src={FastFoodBanner} alt="Angkor Wat Banner" />
          </div>
          <div className={styles.text}>Fast Food</div>
        </button>
      </Link>
    </div>
    </>
  )
}
