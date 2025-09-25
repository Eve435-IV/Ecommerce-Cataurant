import React from 'react'
import styles from "./fastfood.module.css"

export default function FastFoodLayout() {
  return (
    <div className={styles.container}>
        
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 1
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 2
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 3
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 4
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 5
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 6
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 7
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 8
            </p>
        </div>
        <div className={ styles.box}>
            <p className={styles.text}>
                Food 9
            </p>
        </div>
        
    </div>
  )
}
