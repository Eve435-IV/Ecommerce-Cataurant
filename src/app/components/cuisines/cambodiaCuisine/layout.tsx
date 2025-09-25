"use client"
import React from 'react'
import styles from "./cambodiacuisine.module.css"
import Image from 'next/image';
import ChickenCurry from "./public/chickencurry.png";
import NormalNoodle from "./public/normalnoodle.png"
import SpicyNoodle from "./public/spicynoodle.png"
import Tomyum from "./public/tomyum.png"
import Action from "./action"


const productData = [
  {
    product_name: "Chicken Curry",
    product_price: "2.99$",
    product_src: ChickenCurry,
  },
  {
    product_name: "Noodle",
    product_price: "1.99$",
    product_src: NormalNoodle,
  },
  {
    product_name: "Spicy Noodle",
    product_price: "1.99$",
    product_src: SpicyNoodle,
  },
  {
    product_name: "Tom Yum",
    product_price: "4.99$",
    product_src: Tomyum,
  },

]

export default function SouthKoreaLayout() {


  return (
    <div className={styles.container}>
      {productData?.map((product: any, index: any) => (
        <div  key={product?.id ?? index}>
          <div className={styles.box}>
            <Image
              className={styles.image}
              src={product?.product_src}
              alt={product?.product_name}
            />
            <div className={styles.pricecontainer}>
              <div className={styles.cartContainer}>
                <div className={styles.text}>{product?.product_name}</div>
                <div className={styles.price}>{product?.product_price}</div>
              </div>
              <div className={styles.cartContainer}>
                <Action />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
