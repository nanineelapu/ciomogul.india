import { SkPageHead, SkShell, SkTiles } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead />
      <div className="wrap" style={{ marginTop: 8 }}>
        <SkTiles count={6} />
      </div>
    </SkShell>
  );
}
