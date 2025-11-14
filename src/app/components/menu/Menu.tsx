import React from "react";
import styles from "./menu.module.css";
import { PawPrint } from "lucide-react";

function Menu() {
  return (
    <div className={styles.mainContianer}>
      <PawPrint className={styles.icon} />
    </div>
  );
}

export default Menu;
