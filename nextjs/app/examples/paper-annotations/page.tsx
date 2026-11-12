import ExampleFrame from "../ExampleFrame";
import Gallery from "./Gallery";

export const metadata = { title: "Paper as an interface" };
export default function Page() {
  return <ExampleFrame slug="paper-annotations" showHero={false}><Gallery /></ExampleFrame>;
}
