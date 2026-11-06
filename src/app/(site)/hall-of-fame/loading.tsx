import { Sk, SkShell } from "@/components/skeleton/Skeleton";

// Shown instantly while this page loads: the centred showcase, as grey shapes.
export default function Loading() {
  return (
    <SkShell>
      <div className="wrap" style={{ display: "grid", justifyItems: "center", paddingTop: 44 }}>
        <Sk w={190} h={12} />
        <Sk w="min(420px, 80%)" h={16} style={{ marginTop: 18 }} />
        <div className="sk-row" style={{ marginTop: 40, justifyContent: "center", flexWrap: "nowrap", alignItems: "center" }}>
          <Sk className="sk-cover" w={150} style={{ opacity: 0.5 }} />
          <Sk className="sk-cover" w={190} style={{ opacity: 0.75 }} />
          <Sk className="sk-cover" w={250} />
          <Sk className="sk-cover" w={190} style={{ opacity: 0.75 }} />
          <Sk className="sk-cover" w={150} style={{ opacity: 0.5 }} />
        </div>
        <Sk w="min(520px, 85%)" h={46} style={{ marginTop: 44 }} />
        <Sk w="min(320px, 70%)" h={16} style={{ marginTop: 16 }} />
        <div className="sk-row" style={{ marginTop: 28, justifyContent: "center" }}>
          <Sk w={170} h={52} />
          <Sk w={170} h={52} />
        </div>
      </div>
    </SkShell>
  );
}
