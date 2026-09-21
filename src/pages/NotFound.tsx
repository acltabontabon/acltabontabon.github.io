import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import Seo from "@/components/Seo";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="Nothing here." />
      <PageHead
        title="Nothing on the workbench here"
        lead={
          <>
            Whatever you were looking for isn&apos;t in the Garage. <PageHead.Soft>Maybe it never was.</PageHead.Soft>
          </>
        }
        meta="Error 404"
      />
      <Link className={styles.home} to="/">
        Back home <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}
