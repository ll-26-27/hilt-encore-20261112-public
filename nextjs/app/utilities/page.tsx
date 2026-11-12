import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { readDoc, withoutH1 } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Utilities" };

// What the utilities in this repo's ll-utilities/ are, why you'd use them, and how to run them: content/utilities.md.
export default async function UtilitiesPage() {
  const doc = await readDoc("utilities.md");
  const title = (typeof doc.data.title === "string" && doc.data.title) || doc.content.match(/^#\s+(.+)$/m)?.[1] || "Utilities";
  const lede = [doc.data.subtitle, doc.data.description].find((v): v is string => typeof v === "string" && v.trim() !== "") ?? "";
  return (
    <>
      <SiteHeader current="utilities" />
      <main id="main" className="article-shell">
        <header className="article-heading">
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
        </header>
        <div className="prose">
          {doc.missing ? <p className="placeholder">Coming soon.</p> : <Markdown content={withoutH1(doc.content)} />}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
