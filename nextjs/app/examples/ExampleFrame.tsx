import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import Markdown from "@/app/components/Markdown";
import { getExample } from "@/lib/examples";

// The frame every example page shares: title, CX's words ("What this is" above the demo, "How we made it" and
// "Source" below), and the credit to the public repo it came from. `recorded` labels pages whose model output was
// generated beforehand and saved in the repo, so nothing calls a model from the browser.
export default async function ExampleFrame({ slug, recorded, children, showHero = true }: { slug: string; recorded?: string; children: React.ReactNode; showHero?: boolean }) {
  const ex = await getExample(slug);
  const what = ex.sections["what this is"];
  const how = ex.sections["how we made it"];
  const source = ex.sections["source"];
  return (
    <>
      <SiteHeader current="examples" />
      <main id="main" className="example-shell">
        <nav className="breadcrumbs"><Link href="/examples">Examples</Link><span>/</span><span>{ex.title}</span></nav>
        <header className="example-head">
          <h1>{ex.title}</h1>
          {ex.index && <p className="lede">{ex.index}</p>}
          {ex.source && <p className="example-credit">
            From <a href={ex.source} target="_blank" rel="noreferrer">{ex.source.replace(/^https:\/\/(github\.com\/)?/, "")}</a>
            {ex.demo && <> · <a href={ex.demo} target="_blank" rel="noreferrer">open the original ↗</a></>}
          </p>}
          {what && <div className="prose example-what"><Markdown content={what} dir="examples" /></div>}
        </header>
        {showHero && <figure className="example-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ex.image} alt="" fetchPriority="high" />
        </figure>}
        {recorded && <p className="example-recorded">Recorded: {recorded}</p>}
        <section className="example-demo">{children}</section>
        <section className="example-notes prose">
          <h2>How we made it</h2>
          {how ? <Markdown content={how} dir="examples" /> : <p className="placeholder">Coming soon.</p>}
          {source && (<><h2>Source</h2><Markdown content={source} dir="examples" /></>)}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
