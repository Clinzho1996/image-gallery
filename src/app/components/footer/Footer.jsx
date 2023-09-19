import React from "react";
import styles from "./footer.module.css";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.container}>
      <center>
        <div className={styles.copyFooter}>
          &copy; 2023
          <Link
            href="https://devclinton.netlify.app/"
            className={styles.copy}
            target="_blank"
          >
            <span className={styles.dev}>
              Designed & Developed by Confidence Emonena 
            </span>
          </Link>
          | All Rights Reserved
        </div>
      </center>
    </div>
  );
};

export default Footer;
