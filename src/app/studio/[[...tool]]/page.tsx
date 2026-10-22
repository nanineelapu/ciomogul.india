// Mounts the Sanity Studio at /studio. The catch-all route is required so
// internal Studio navigation (tool switching, document ids, deeplinks) all
// resolves to this handler.
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Studio must own its own viewport & chrome
export const dynamic = "force-static";
export const viewport = { width: "device-width", initialScale: 1 };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
