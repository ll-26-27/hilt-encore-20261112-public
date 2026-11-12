import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/Chrome";
import { getExamples } from "@/lib/examples";

export const dynamic = "force-dynamic";
export const metadata = { title: "Examples" };

// One card per example: its image, title, and one line. Every example runs in the browser on its own.
export default async function ExamplesPage() {
  const examples = await getExamples();
  return (
    <>
      <SiteHeader current="examples" />
      <main id="main" className="examples-index">
        <header className="article-heading">
          <h1>Examples</h1>
          <p className="lede">Things we built with faculty and students this year. Explore the interactives, follow a playthrough, or look inside the work through images and recordings.</p>
        </header>
        <div className="example-cards">
          {examples.map((ex) => (
            <Link key={ex.slug} href={`/examples/${ex.slug}`} className="example-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ex.image} alt="" loading="lazy" />
              <strong>{ex.title}</strong>
              <span>{ex.index}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
