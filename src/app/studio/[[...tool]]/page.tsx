// Mounts the Sanity Studio at /studio. The catch-all route is required so
// internal Studio navigation (tool switching, document ids, deeplinks) all
// resolves to this handler.
import Studio from "./Studio";

export const viewport = { width: "device-width", initialScale: 1 };

export default function StudioPage() {
  return <Studio />;
}
