import ExampleFrame from "../ExampleFrame";
import RecipeGallery from "./RecipeGallery";

export const metadata = { title: "The recipe-card gallery" };

export default function Page() {
  return (
    <ExampleFrame slug="recipe-cards" recorded="the gallery Claude built in the workshop, from bok-learning-lab/claude-workshop-materials (activities/recipes). Renames, transcriptions and history notes are Claude's saved output.">
      <RecipeGallery />
    </ExampleFrame>
  );
}
