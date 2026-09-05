import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nesting from "postcss-nesting";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  css: {
    postcss: {
      plugins: [nesting()],
    },
  },
  ssgOptions: {
    // NOTE: don't set script: "async" here — the main bundle reads
    // window.__VITE_REACT_SSG_HASH__ from an inline <script> placed at the
    // end of <body>, and an async module script can execute before the
    // parser gets there, breaking hydration (manifest fetched as
    // ".../undefined.json"). Default (module scripts are deferred by spec)
    // keeps execution order correct.
    // /blog/foo -> /blog/foo/index.html, so GitHub Pages serves clean URLs.
    dirStyle: "nested",
  },
});
