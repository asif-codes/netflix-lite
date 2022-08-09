import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  const handleOnChangeEmail: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setUserMsg("");
    const email = event.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail: React.ReactEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();

    if (email) {
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({ email });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "applicaiton/json",
            },
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Something went wrong logging in.", error);
      }
    } else {
      setIsLoading(false);
      setUserMsg("Enter a valid email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128px"
                height="34px"
              />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type={"email"}
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
