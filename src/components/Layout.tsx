import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import styles from "./Layout.module.css";

// One shell for every page: the same gutters, header and footer. Each page
// renders its own <Seo/> and decides its own content width inside <main>.
export default function Layout() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
