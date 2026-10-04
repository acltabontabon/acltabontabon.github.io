import { Outlet, ScrollRestoration, useLocation, useNavigation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import styles from "./Layout.module.css";

export default function Layout() {
  const location = useLocation();
  const home = (location.pathname.replace(/\/+$/, "") || "/") === "/";
  const loading = useNavigation().state !== "idle";

  return (
    <div className={`${styles.shell}${home ? ` ${styles.home}` : ""}`}>
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className={styles.main} tabIndex={-1} aria-busy={loading}>
        <div key={location.key} className={styles.page}>
          <Outlet />
        </div>
      </main>
      <Footer compact={home} />
      <div className={styles.loading} data-loading={loading} aria-hidden="true">
        <div className={styles.loadingIdentity}>
          <span className={styles.loadingMark}>act<span>.</span></span>
          <span className={styles.loadingTrack} />
          <span className={styles.loadingLabel}>Loading</span>
        </div>
      </div>
      <span className="visually-hidden" role="status">{loading ? "Loading page" : ""}</span>
      <ScrollRestoration />
    </div>
  );
}
