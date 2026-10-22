import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, SINGLETON_TYPES } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

// Config used by both the embedded /studio route and the sanity CLI
// (sanity deploy, sanity graphql deploy, etc). If no projectId is set, the
// studio will still mount but every query will fail — the frontend's
// hard-coded fallbacks keep the public site working regardless.
export default defineConfig({
  name: "default",
  title: "CIO Mogul India",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // homepageConfig is a singleton — hide "Create new" everywhere it would
    // normally appear so editors can't accidentally make a second copy.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : prev,
  },
});
