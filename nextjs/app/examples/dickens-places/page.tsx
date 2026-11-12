import ExampleFrame from "../ExampleFrame";
import DickensMap from "./DickensMap";

export const metadata = { title: "Dickens's places" };

export default function Page() {
  return (
    <ExampleFrame slug="dickens-places" showHero={false} recorded="the project's map of 2026-11-03 (outputs/index.html), copied unchanged. Places found by anthropic/claude-haiku-5.5, located by OpenStreetMap's Nominatim, with some locations estimated by anthropic/claude-sonnet-5.5; all saved in the page, so no model is called from your browser.">
      <DickensMap />
    </ExampleFrame>
  );
}
