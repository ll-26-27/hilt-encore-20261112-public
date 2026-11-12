import ExampleFrame from "../ExampleFrame";
import Interruptions from "./Interruptions";
import "./interruptions.css";

export const metadata = { title: "Interruptions" };
export default function Page() {
  return <ExampleFrame slug="interruptions"><Interruptions /></ExampleFrame>;
}
