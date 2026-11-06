import { SkPageHead, SkPosts, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead />
      <div className="wrap" style={{ marginTop: 8 }}>
        <SkPosts count={3} />
      </div>
    </SkShell>
  );
}
