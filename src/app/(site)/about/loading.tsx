import { SkPageHead, SkShell, SkLines } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead big buttons />
      <div className="wrap" style={{ marginTop: 24, maxWidth: 760 }}>
        <SkLines n={4} h={16} gap={12} />
      </div>
    </SkShell>
  );
}
