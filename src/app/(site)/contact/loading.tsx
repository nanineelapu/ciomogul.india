import { SkPageHead, SkShell, Sk } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkPageHead />
      <div className="wrap" style={{ marginTop: 8, maxWidth: 640 }}>
        <Sk h={52} style={{ marginBottom: 16 }} />
        <Sk h={52} style={{ marginBottom: 16 }} />
        <Sk h={150} style={{ marginBottom: 20 }} />
        <Sk w={170} h={52} />
      </div>
    </SkShell>
  );
}
