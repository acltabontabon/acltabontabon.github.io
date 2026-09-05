import type { RouteRecord } from "vite-react-ssg";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Garage from "./pages/Garage";
import GarageDetail from "./pages/GarageDetail";
import About from "./pages/About";
import Tags from "./pages/Tags";
import TagDetail from "./pages/TagDetail";
import NotFound from "./pages/NotFound";
import { blogEntries, garageEntries, allTags } from "./content/loader";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blog", element: <Blog /> },
      {
        path: "blog/:slug",
        element: <BlogPost />,
        getStaticPaths: () => blogEntries.map((e) => `blog/${e.slug}`),
      },
      { path: "garage", element: <Garage /> },
      {
        path: "garage/:slug",
        element: <GarageDetail />,
        getStaticPaths: () => garageEntries.filter((e) => e.html).map((e) => `garage/${e.slug}`),
      },
      { path: "about", element: <About /> },
      { path: "tags", element: <Tags /> },
      {
        path: "tags/:tag",
        element: <TagDetail />,
        getStaticPaths: () => allTags().map((t) => `tags/${encodeURIComponent(t)}`),
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
