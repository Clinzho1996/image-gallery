"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
    if (session.status === "authenticated") {
      router?.push("/");
    }
  }, [params, session.status, router]);

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
        redirect: false,
      });
      setFormSubmitted(true);
    } catch (error) {
      setError("Invalid email or password");
      setFormSubmitted(true);
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
        {formSubmitted && error !== "" && (
          <p style={{ color: "red" }}>Something went wrong!</p>
        )}
      </form>
      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/register">
        Create a new account
      </Link>
    </div>
  );
};

export default Login;
