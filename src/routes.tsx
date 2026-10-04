import type { RouteRecord } from "vite-react-ssg";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { blogEntries, garageEntries, allTags } from "./content/loader";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blog", lazy: () => import("./pages/Blog").then((page) => ({ Component: page.default })) },
      {
        path: "blog/:slug",
        lazy: () => import("./pages/BlogPost").then((page) => ({ Component: page.default })),
        loader: async ({ params }) => {
          // Production navigation reads SSG's per-route data files. Excluding
          // this branch from client builds also prevents article preloads.
          if (import.meta.env.SSR || import.meta.env.DEV) {
            return (await import("./content/detail")).loadBlogEntry(params.slug);
          }
          return null;
        },
        getStaticPaths: () => blogEntries.map((e) => `blog/${e.slug}`),
      },
      { path: "garage", lazy: () => import("./pages/Garage").then((page) => ({ Component: page.default })) },
      {
        path: "garage/:slug",
        lazy: () => import("./pages/GarageDetail").then((page) => ({ Component: page.default })),
        loader: async ({ params }) => {
          if (import.meta.env.SSR || import.meta.env.DEV) {
            return (await import("./content/detail")).loadGarageEntry(params.slug);
          }
          return null;
        },
        getStaticPaths: () => garageEntries.filter((e) => e.hasBody).map((e) => `garage/${e.slug}`),
      },
      { path: "about", lazy: () => import("./pages/About").then((page) => ({ Component: page.default })) },
      { path: "tags", lazy: () => import("./pages/Tags").then((page) => ({ Component: page.default })) },
      {
        path: "tags/:tag",
        lazy: () => import("./pages/TagDetail").then((page) => ({ Component: page.default })),
        getStaticPaths: () => allTags().map((t) => `tags/${encodeURIComponent(t)}`),
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
