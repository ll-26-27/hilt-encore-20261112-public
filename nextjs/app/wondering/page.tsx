import { Placeholder, SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getPage("wondering")).title };
}

export default async function Wondering() {
  const page = await getPage("wondering");
  return (
    <>
      <SiteHeader current="" />
      <main id="main" className="article-shell">
        <header className="article-heading">
          <p className="eyebrow">HILT Encore 2026</p>
          <h1>{page.title}</h1>
          {page.subtitle && <p className="lede">{page.subtitle}</p>}
        </header>
        <div className="prose">
          {page.missing ? <Placeholder>What we learned, and what we're still wondering, will be here after the talk.</Placeholder> : <Markdown content={page.content} />}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
