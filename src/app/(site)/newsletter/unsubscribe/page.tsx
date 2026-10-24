import type { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeForm from "@/components/home/UnsubscribeForm";
import { verifyEmailToken } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Unsubscribe — CIO Mogul India",
  robots: { index: false, follow: false },
};

async function UnsubscribeContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email.trim().toLowerCase() : "";
  const token = typeof sp.token === "string" ? sp.token : "";
  const valid = email !== "" && verifyEmailToken(email, token);

  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Unsubscribe</h1>
          {valid ? (
            <UnsubscribeForm email={email} token={token} />
          ) : (
            <p className="page-lead__sub">
              This unsubscribe link is not valid. If you want to stop receiving our emails, please
              contact us and we will remove you.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

// Reading the address from the URL suspends, so it runs inside Suspense.
export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={null}>
      <UnsubscribeContent searchParams={searchParams} />
    </Suspense>
  );
}
