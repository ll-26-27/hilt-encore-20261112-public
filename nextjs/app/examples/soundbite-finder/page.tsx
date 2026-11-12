import ExampleFrame from "../ExampleFrame";
import ScreenshotCards from "./ScreenshotCards";

export const metadata = { title: "Soundbite finder" };

export default function SoundbiteFinderPage() {
  return (
    <ExampleFrame slug="soundbite-finder" showHero={false}>
      <ScreenshotCards />
    </ExampleFrame>
  );
}
