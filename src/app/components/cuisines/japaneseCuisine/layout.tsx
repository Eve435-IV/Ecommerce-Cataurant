"use client"
import React from 'react'
import styles from "./japanesecuisine.module.css"
import Image from 'next/image';
import Katsudon from "./public/katsudon.png";
import PorkTeriyaki from "./public/porkteriyaki.png"
import Ramen from "./public/ramenbowl.png"
import Sushi from "./public/sushi.png"
import Takoyaki from "./public/takoyaki.png"
import Action from "./action"


const productData = [
  {
    product_name: "Katsudon",
    product_price: "2.99$",
    product_src: Katsudon,
  },
  {
    product_name: "Pork Teriyaki",
    product_price: "3.99$",
    product_src: PorkTeriyaki,
  },
  {
    product_name: "Ramen",
    product_price: "2.99$",
    product_src: Ramen,
  },
  {
    product_name: "Sushi",
    product_price: "9.99$",
    product_src: Sushi,
  },
   {
    product_name: "Takoyaki",
    product_price: "3.99$",
    product_src: Takoyaki,
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
