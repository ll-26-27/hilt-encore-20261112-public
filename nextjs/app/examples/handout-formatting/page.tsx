import { readFile } from "node:fs/promises";
import path from "node:path";
import ExampleFrame from "../ExampleFrame";
import Handouts from "./Handouts";

export const metadata = { title: "One source, every handout" };

export default async function Page() {
  // The Spanish draft as it came in (extracted from the .docx on Nov 12 and saved beside the page images).
  const draft = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), "public/examples/handout-formatting/es-draft.txt"), "utf8");
  return (
    <ExampleFrame slug="handout-formatting" recorded="page images rendered from the saved PDFs; nothing is compiled here">
      <Handouts draft={draft} />
    </ExampleFrame>
  );
}
