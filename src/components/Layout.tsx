import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import styles from "./Layout.module.css";

export default function Layout() {
  const home = (useLocation().pathname.replace(/\/+$/, "") || "/") === "/";

  return (
    <div className={`${styles.shell}${home ? ` ${styles.home}` : ""}`}>
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer compact={home} />
      <ScrollRestoration />
    </div>
  );
}
