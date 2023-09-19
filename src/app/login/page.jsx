"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  const session = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const queryError = router.query?.error;
    setError(queryError ? decodeURIComponent(queryError) : "");
    setSuccess(router.query?.success || "");
  }, [router.query]);

  if (session.status === "loading") {
    return (
      <div className={styles.loader}>
        <Image src="/loader.svg" alt="loading" width={100} height={100} />
      </div>
    );
  }

  if (session.status === "authenticated") {
    router.push("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signIn("credentials", {
        email,
        password,
      });
      // If successful, it won't reach here, and you should rely on the session status change
    } catch (error) {
      setError("Invalid email or password"); // Set the error message
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
      <h2 className={styles.subtitle}>Please sign in to use features</h2>
      <p className={styles.details}>
        <span
          style={{
            color: "#f84e61",
            marginRight: "10px",
          }}
        >
          Email:
        </span>
        user@example.com
      </p>{" "}
      <p className={styles.details}>
        <span
          style={{
            color: "#f84e61",
            marginRight: "10px",
          }}
        >
          Password:
        </span>
        1Password
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className={styles.input}
        />
        <button className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}{" "}
      {/* Display error message */}
      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/register">
        Create a new account
      </Link>
    </div>
  );
};

export default Login;
