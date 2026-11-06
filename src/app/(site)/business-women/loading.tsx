import { SkCovers, SkPageHead, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead buttons />
      <div className="wrap" style={{ marginTop: 24 }}>
        <SkCovers count={4} />
      </div>
    </SkShell>
  );
}
