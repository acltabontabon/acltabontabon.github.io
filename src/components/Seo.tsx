import { Head } from "vite-react-ssg";
import { site } from "@/site";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export default function Seo({
  title,
  description = site.description,
  path = "/",
  image = "/images/social.png",
  type = "website",
  noindex = false,
}: SeoProps) {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const canonical = new URL(path, `${site.url}/`);
  // Match the directory URLs served by GitHub Pages and listed in sitemap.xml.
  canonical.pathname = `${canonical.pathname.replace(/\/$/, "")}/`;
  canonical.search = "";
  canonical.hash = "";
  const url = canonical.href;
  const ogImage = new URL(image, `${site.url}/`).href;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
