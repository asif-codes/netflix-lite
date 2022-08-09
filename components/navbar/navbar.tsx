import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const NavBar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [didToken, setDidToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { email } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.error("Error retrieving email", error);
      }
    };

    getUserEmail();
  }, []);

  const handleOnClickHome: React.ReactEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList: React.ReactEventHandler<HTMLLIElement> = (
    event
  ) => {
    event.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown: React.ReactEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignOut: React.ReactEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
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
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                src="/static/expand_more.svg"
                alt="Expand dropdown"
                width="24"
                height="24"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignOut}>
                    Sign Out
                  </a>
                </div>
                <div className={styles.lineWrapper} />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
