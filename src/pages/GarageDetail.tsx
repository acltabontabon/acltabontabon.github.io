import { useParams } from "react-router-dom";
import HeaderAvatar from "@/components/HeaderAvatar";
import ArticleLayout from "@/components/ArticleLayout";
import GarageStatusBadge from "@/components/GarageStatusBadge";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { garageEntries, findBySlug } from "@/content/loader";

export default function GarageDetail() {
  const { slug } = useParams();
  const entry = findBySlug(garageEntries, slug);
  if (!entry || !entry.html) return <NotFound />;

  return (
    <>
      <Seo
        title={entry.meta.title}
        description={entry.meta.description}
        path={`/garage/${entry.slug}`}
        image={entry.meta.screenshot}
        type="article"
      />
      <HeaderAvatar compact />
      <ArticleLayout
        title={entry.meta.title}
        date={entry.meta.date}
        readingTime={entry.readingTime}
        tags={entry.meta.tags}
        html={entry.html}
        backTo="/garage"
        backLabel="Back to Garage"
        statusBadge={<GarageStatusBadge status={entry.meta.status} />}
        github={entry.meta.github}
        liveUrl={entry.meta.liveUrl}
      />
    </>
  );
}
