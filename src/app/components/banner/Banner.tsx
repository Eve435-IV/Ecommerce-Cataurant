import React from "react";
import styles from "./banner.module.css";
import Image from "next/image";
import Koreanbanner from "../../../../public/koreanfoodbanner.jpg";
import Cat_chef from "./public/AdobeStock_1184436869_Preview.jpeg";

export default function Banner() {
  return (
    <>
      <div className={styles.mainbanner}>
        <div className={styles.leftbanner}>
          {/* <Image className={styles.image} src={} alt="Korean Food" /> */}
        </div>
        <div className={styles.midbanner}>
          {/* <Image
            className={styles.image}
            src={Cat_chef}
            alt="Korean Food"
            // width={300}
            // height={200}
          /> */}
          <div className={styles.toptext}>Explore &</div>
          <div className={styles.midtext}>Discover</div>
          <div className={styles.bottext}>New tastebuds!</div>
          {/* <div className={styles.smalltext}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt quidem voluptates sed officiis dolore, aliquam quos aperiam architecto nam aspernatur, quisquam cum similique suscipit distinctio nobis earum dolores repellat unde. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores, et aperiam. Repudiandae doloribus, alias vel autem nesciunt incidunt illo voluptas odio modi sed aperiam nihil molestiae. Magnam similique voluptas delectus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure cum doloribus magnam sapiente nobis veritatis ea nisi amet dolore modi consectetur laudantium sed rem, voluptas, quasi ut harum aperiam quia.
          </div>           */}
        </div>
        <div className={styles.rightbanner}>
          {/* <Image
            className={styles.image}
            src={Koreanbanner}
            alt="Korean Food"
          /> */}
        </div>
      </div>
    </>
  );
}
