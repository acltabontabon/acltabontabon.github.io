import { CrateIcon } from "@/components/icons";
import styles from "./GenericArt.module.css";
import type { CoverArtProps } from "./types";

export default function GenericArt({ screenshot, title }: CoverArtProps) {
  return (
    <div className={styles.art}>
      <div className={styles.plate}>
        {screenshot ? (
          <img src={screenshot} alt={`${title} interface`} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.empty}>
            <CrateIcon />
          </div>
        )}
      </div>
    </div>
  );
}
