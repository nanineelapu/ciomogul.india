import { Sk, SkCovers, SkPageHead, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead />
      <div className="wrap" style={{ marginTop: 8 }}>
        <Sk h={56} style={{ marginBottom: 36 }} />
        <SkCovers count={8} />
      </div>
    </SkShell>
  );
}
