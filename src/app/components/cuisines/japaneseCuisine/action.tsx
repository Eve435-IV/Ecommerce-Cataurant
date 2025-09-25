import styles from "./japanesecuisine.module.css";
import Image from "next/image";
import Cart from "../southkoreaCuisine/public/cart.png"
import Payment from "../southkoreaCuisine/public/payment.png";
import { useState } from "react";
import Popup from "./popup";

export default function Action (){
      const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpen = () => setIsPopupOpen(true);
    const handleClose = () => setIsPopupOpen(false);
    return (
        <>
            <div className={styles.cart}>
                <Image className={styles.icon} src={Cart} alt="Cart" />
                <div className={styles.smalltext1}>Add to cart</div>
            </div>
            <div className={styles.buy} onClick={handleOpen}>
                <Image className={styles.icon} src={Payment} alt="Order" />
                <div className={styles.smalltext1}>Order</div>
            </div>
            <Popup open={isPopupOpen} close={handleClose} />
        </>
    )
};
