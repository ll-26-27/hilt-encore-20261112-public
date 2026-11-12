export type Card = {
  title: string;
  note?: string;
  image?: string;
};

export type Deck = {
  id: "concepts" | "cases" | "theories";
  name: string;
  // One-line gloss from the assignment guide: what this kind of card gives you.
  role: string;
  cards: Card[];
};

export const decks: Deck[] = [
  {
    id: "concepts",
    name: "Core Concepts",
    role: "A concept gives you language.",
    cards: [
      { title: "Worldview", image: "/examples/gened1196/cards/worldview.jpg" },
      { title: "Etic and Emic Perspective", image: "/examples/gened1196/cards/etic-and-emic-perspective.jpg" },
      { title: "Tradition Bearer", image: "/examples/gened1196/cards/tradition-bearer.jpg" },
      { title: "Folklore", image: "/examples/gened1196/cards/folklore.jpg" },
      { title: "Folk Group", image: "/examples/gened1196/cards/folk-group.jpg" },
      { title: "Tradition", image: "/examples/gened1196/cards/tradition.jpg" },
      { title: "Transmission", image: "/examples/gened1196/cards/transmission.jpg" },
      { title: "Genre", image: "/examples/gened1196/cards/genre.jpg" },
      { title: "Aesthetics", image: "/examples/gened1196/cards/aesthetics.jpg" },
      { title: "Authenticity", image: "/examples/gened1196/cards/authenticity.jpg" },
      { title: "Positionality and Identity", image: "/examples/gened1196/cards/positionality-and-identity.jpg" },
      { title: "Text, Context, and Texture", image: "/examples/gened1196/cards/text-context-and-texture.jpg" },
      { title: "Triviality Barrier", image: "/examples/gened1196/cards/triviality-barrier.jpg" },
      { title: "Performance", image: "/examples/gened1196/cards/performance.jpg" },
    ],
  },
  {
    id: "cases",
    name: "Case Studies",
    role: "A case study gives you evidence.",
    cards: [
      { title: "The Folk Revival", image: "/examples/gened1196/cards/the-folk-revival.jpg" },
      { title: "ShantyTok", image: "/examples/gened1196/cards/shantytok.jpg" },
      { title: "Waulking Songs", image: "/examples/gened1196/cards/waulking-songs.jpg" },
      { title: "String Games and Coyote Stories", image: "/examples/gened1196/cards/string-games-and-coyote-stories.jpg" },
      { title: "Water", image: "/examples/gened1196/cards/water.jpg" },
      { title: "Thermal Pools", image: "/examples/gened1196/cards/thermal-pools.jpg" },
      { title: "Jokes", image: "/examples/gened1196/cards/jokes.jpg" },
      { title: "The Parry-Lord Project", image: "/examples/gened1196/cards/the-parry-lord-project.jpg" },
      { title: "Folklore and Nation-Building", image: "/examples/gened1196/cards/folklore-and-nation-building.jpg" },
      { title: "Francis James Child", image: "/examples/gened1196/cards/francis-james-child.jpg" },
      { title: "Biscuits", image: "/examples/gened1196/cards/biscuits.jpg" },
      { title: "Balkan guslars", image: "/examples/gened1196/cards/balkan-guslars.jpg" },
      { title: "Bulgarian horo", image: "/examples/gened1196/cards/bulgarian-horo.jpg" },
      { title: "Murder Ballads", image: "/examples/gened1196/cards/murder-ballads.jpg" },
      { title: "Irish Language Revival", image: "/examples/gened1196/cards/irish-language-revival.jpg" },
      { title: "The Lomaxes", note: "John, Alan, and Bess", image: "/examples/gened1196/cards/the-lomaxes.jpg" },
      { title: "HarvardLore", image: "/examples/gened1196/cards/harvardlore.jpg" },
      { title: "Wild Card", note: "Any case study of your choosing", image: "/examples/gened1196/cards/wild-card.jpg" },
    ],
  },
  {
    id: "theories",
    name: "Theoretical Models, Approaches & Interventions",
    role: "A theory gives you perspective.",
    cards: [
      { title: "Ethnography of Communication / Speaking", image: "/examples/gened1196/cards/ethnography-of-communication.jpg" },
      { title: "Attention and Aesthetics", image: "/examples/gened1196/cards/attention-and-aesthetics.jpg" },
      { title: "Oral Formulaic Theory", image: "/examples/gened1196/cards/oral-formulaic-theory.jpg" },
      { title: "The Twin Laws of Tradition", image: "/examples/gened1196/cards/the-twin-laws-of-tradition.jpg" },
      { title: "Ethnography / Fieldwork", image: "/examples/gened1196/cards/ethnography-and-fieldwork.jpg" },
      { title: "Performance Theory", image: "/examples/gened1196/cards/performance-theory.jpg" },
      { title: "Historic-Geographic Method", image: "/examples/gened1196/cards/historic-geographic-method.jpg" },
      { title: "Intersectionality", image: "/examples/gened1196/cards/intersectionality.jpg" },
    ],
  },
];
