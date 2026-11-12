import ExampleFrame from "../ExampleFrame";
import FrankensteinRevisions from "./FrankensteinRevisions";

export const metadata = { title: "Frankenstein, 1818 and 1831" };

export default function Page() {
  return (
    <ExampleFrame slug="frankenstein-revisions" recorded="the pipeline run of 2026-11-03 (Claude Haiku 5.5 sorted the changes, Claude Sonnet 5.5 checked a sample; $0.70 in all). This page shows its saved outputs.">
      <FrankensteinRevisions />
    </ExampleFrame>
  );
}
