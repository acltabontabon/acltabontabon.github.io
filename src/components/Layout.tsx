import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

// Every page renders its own <Seo/> with page-specific title/description, so
// Layout doesn't need a default one.
export default function Layout() {
  // The homepage is a full-height composition — identity optically centred,
  // footer pinned at the bottom. Every other page is a normal document.
  const isHome = useLocation().pathname === "/";

  return (
    <div className={isHome ? "wrapper wrapper--home" : "wrapper"}>
      <Outlet />
      <Footer minimal={isHome} />
    </div>
  );
}
