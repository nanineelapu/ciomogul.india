import { SkArticle, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkArticle />
    </SkShell>
  );
}
