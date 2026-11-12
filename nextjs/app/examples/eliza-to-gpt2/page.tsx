import ExampleFrame from "../ExampleFrame";
import WhoIsSpeaking from "./WhoIsSpeaking";

export const metadata = { title: "Who is speaking?" };

export default function Page() {
  return (
    <ExampleFrame slug="eliza-to-gpt2" recorded="the GPT-2 runs were recorded on 20 Oct 2026 and saved; ELIZA runs live in your browser">
      <WhoIsSpeaking />
    </ExampleFrame>
  );
}
