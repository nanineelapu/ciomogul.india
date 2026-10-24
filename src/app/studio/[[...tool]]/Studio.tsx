"use client";
// The Studio runs in the browser only. Rendering it on the server needs a real
// Sanity project ID and pulls Sanity's libraries into the server build.
import dynamic from "next/dynamic";

const StudioApp = dynamic(() => import("./StudioApp"), { ssr: false });

export default function Studio() {
  return <StudioApp />;
}
