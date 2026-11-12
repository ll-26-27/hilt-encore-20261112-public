import ExampleFrame from "../ExampleFrame";
import Ekphrasis from "./Ekphrasis";

export const metadata = { title: "Ekphrasis" };
export default function Page() {
  return <ExampleFrame slug="ekphrasis" showHero={false}><Ekphrasis /></ExampleFrame>;
}
