import { useEffect } from "react";
import HeaderAvatar from "@/components/HeaderAvatar";
import NoodleSketch from "@/components/doodles/NoodleSketch";
import ClosingSquiggle from "@/components/doodles/ClosingSquiggle";
import Seo from "@/components/Seo";
import styles from "./Home.module.css";

export default function Home() {
  useEffect(() => {
    console.log("$ ./mvnw spring-boot:run");
    console.log("Started AlvinApplication in 0.420 seconds");
  }, []);

  return (
    <>
      <Seo />
      <NoodleSketch />
      <main className={styles.stage}>
        <HeaderAvatar />
        <ClosingSquiggle className={styles.closer} />
      </main>
    </>
  );
}
