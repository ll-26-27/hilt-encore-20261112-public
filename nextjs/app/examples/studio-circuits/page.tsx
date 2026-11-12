import ExampleFrame from "../ExampleFrame";
import Studio from "./Studio";
import "./installation.css";

export const metadata = { title: "Studio circuits" };
export default function Page() {
  return <ExampleFrame slug="studio-circuits"><Studio /></ExampleFrame>;
}
