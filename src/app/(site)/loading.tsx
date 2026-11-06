import { SkCovers, SkHero, SkSectionHead, SkTiles, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads.
export default function Loading() {
  return (
    <SkShell>
      <SkHero />
      <div className="wrap" style={{ marginTop: 56 }}>
        <SkSectionHead />
        <SkCovers count={4} />
      </div>
      <div className="wrap" style={{ marginTop: 64 }}>
        <SkSectionHead w={300} />
        <SkTiles count={5} cols={5} />
      </div>
    </SkShell>
  );
}
