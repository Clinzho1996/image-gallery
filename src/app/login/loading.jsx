import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

const Loading = () => {
  return (
    <div className={styles.loader}>
      <Image src="/loader.svg" alt="loading" width={100} height={100} />
    </div>
  );
};

export default Loading;
