import ExampleFrame from "../ExampleFrame";
import AuthorialAbsence from "./AuthorialAbsence";

export const metadata = { title: "Authorial Absence" };

export default function Page() {
  return (
    <ExampleFrame slug="authorial-absence" recorded="originally generated live in the browser by OpenAI's gpt-4o; here every output was pre-written by Claude (Claude Code, Opus 5.5, Nov 12, 2026) from the app's own prompts, two rounds per text, saved as JSON with each prompt.">
      <AuthorialAbsence />
    </ExampleFrame>
  );
}
