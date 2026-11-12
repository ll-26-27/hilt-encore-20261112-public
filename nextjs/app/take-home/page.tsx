import { Placeholder, SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getPage("take-home")).title };
}

export default async function TakeHome() {
  const page = await getPage("take-home");
  return (
    <>
      <SiteHeader current="take-home" />
      <main id="main" className="article-shell">
        <header className="article-heading">
          <p className="eyebrow">HILT Encore 2026</p>
          <h1>{page.title}</h1>
          {page.subtitle && <p className="lede">{page.subtitle}</p>}
        </header>
        <div className="prose">
          {page.missing ? <Placeholder>The repos, tools, and examples from the talk are being gathered this morning.</Placeholder> : <Markdown content={page.content} />}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
