"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        D&D Image Gallery
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {session.status === "authenticated" && (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
