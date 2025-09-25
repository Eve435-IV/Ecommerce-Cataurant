"use client";
import React, { useState } from "react";
import Popup from "./popup";
import styles from "./southkoreacuisine.module.css";
import Image from "next/image";
import Kimchi2 from "../../../../../public/kimchi2.png";
import bibimbap2 from "../../../../../public/bibimbap2.png";
import bibambap3 from "../../../../../public/bibimbap3.png";
import tteokbokki1 from "../../../../../public/tteokbokki1.png";
import Kimchistew from "../../../../../public/kimchistew.png";
import Jajangmyeon from "../../../../../public/jajangmyeon.png";
import Bulgogikimchi from "../../../../../public/bulgogikimchi.png";
import tteokbokki2 from "../../../../../public/spicykoreanricecakes.png";
import Gyudon from "../../../../../public/gyudon.png";
import SundubuJjigae from "../../../../../public/sundubujjigae.png";
import GinsengChickenSoup from "../../../../../public/ginsengchickensoup.png";
import Galbi from "../../../../../public/galbi.png";
import Gamjatang from "../../../../../public/gamjatang.png";
import Haemulpajeon from "../../../../../public/haemulpajeon.png";
import Samgyeopsal from "../../../../../public/samgyeopsal.png";
import Cart from "./public/cart.png";
import Payment from "./public/payment.png";
import Action from "./action"

const productData = [
  {
    product_name: "Kimchi",
    product_price: "4.99$",
    product_src: Kimchi2,
  },
  {
    product_name: "Bibimbap",
    product_price: "4.99$",
    product_src: bibimbap2,
  },
  {
    product_name: "Kimchi",
    product_price: "4.99$",
    product_src: bibambap3,
  },
  {
    product_name: "Bibimbap",
    product_price: "4.99$",
    product_src: tteokbokki1,
  },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: Kimchistew,
//   },
//   {
//     product_name: "Bibimbap",
//     product_price: "4.99$",
//     product_src: Jajangmyeon,
//   },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: Bulgogikimchi,
//   },
//   {
//     product_name: "Bibimbap",
//     product_price: "4.99$",
//     product_src: tteokbokki2,
//   },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: Gyudon,
//   },
//   {
//     product_name: "Bibimbap",
//     product_price: "4.99$",
//     product_src: SundubuJjigae,
//   },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: GinsengChickenSoup,
//   },
//   {
//     product_name: "Bibimbap",
//     product_price: "4.99$",
//     product_src: Galbi,
//   },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: Gamjatang,
//   },
//   {
//     product_name: "Bibimbap",
//     product_price:"4.99$",
//     product_src: Haemulpajeon,
//   },
//   {
//     product_name: "Kimchi",
//     product_price: "4.99$",
//     product_src: Samgyeopsal,
//   },

];

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
          {/* <Popup open={isPopupOpen} close={handleClose}/> */}
        </div>
      ))}
    </div>
  );
}
