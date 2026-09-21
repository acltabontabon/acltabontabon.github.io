import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import styles from "./Layout.module.css";

// Pages composed to fit one desktop screen, with no vertical scrolling.
const FITTED = new Set(["/", "/about"]);

// One shell for every page: the same gutters, header and footer. Each page
// renders its own <Seo/> and decides its own content width inside <main>.
export default function Layout() {
  const path = useLocation().pathname.replace(/\/+$/, "") || "/";
  return (
    <div className={FITTED.has(path) ? `${styles.shell} ${styles.fit}` : styles.shell}>
      <SiteHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
