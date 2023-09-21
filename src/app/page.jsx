"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import styles from "./page.module.css";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadedImages from "./components/uploaded/UploadedImages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      // Show a toast alert when not logged in
      toast.error("You are not logged in.", {
        autoClose: 5000,
        onClose: () => {
          router.push("/login");
        },
      });
    }
  }, [session, router]);

  return (
    <div className={styles.card}>
      <ToastContainer />
      <UploadedImages />
    </div>
  );
}

export default Home;
