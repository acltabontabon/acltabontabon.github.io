import HeaderAvatar from "@/components/HeaderAvatar";
import Seo from "@/components/Seo";
import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <Seo title="About" path="/about" description="Casual introduction — not a resume." />
      <HeaderAvatar compact />
      <section className={styles.section}>
        <div className={styles.prose}>
          <p>
            I write a lot of Java and Spring Boot for a living, and somewhere along the way I started enjoying
            it more than I probably should. Most days that means building services that talk to other
            services. Some nights it means building things nobody asked for, which is where the Garage comes
            in.
          </p>
          <p>
            I like software that does exactly what it says and nothing more — which is also roughly my design
            philosophy for this site. If a project here looks unfinished, it probably is. I'd rather ship the
            honest version than a polished lie.
          </p>
          <p>
            Outside of code: podcasts, a healthy amount of time on Reddit, and noodles in most of their forms.
            If you want to talk about any of that — or about the thing you saw in the Garage — the links below
            actually get checked.
          </p>
        </div>
      </section>
    </>
  );
}
