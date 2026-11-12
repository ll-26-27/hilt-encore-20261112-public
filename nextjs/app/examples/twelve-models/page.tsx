import ExampleFrame from "../ExampleFrame";
import TwelveModels from "./TwelveModels";

export const metadata = { title: "Six prompts, twelve image models" };

export default function Page() {
  return (
    <ExampleFrame slug="twelve-models" recorded="images generated in September 2026 and saved; nothing is generated here">
      <TwelveModels />
    </ExampleFrame>
  );
}
