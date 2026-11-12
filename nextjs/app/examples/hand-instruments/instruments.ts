// The four hand instruments, ported from the week 10 experiments in tdm155ai/tdm155ai-week-10 (app/track/fellows/ and
// public/cv/fellows/). Two are the original static pages, copied into public/examples/hand-instruments/play/ and shown
// in a frame; two are the original React components, copied into _lib/. All run in the browser with MediaPipe hand
// tracking; the camera starts only when you press Start, and nothing is recorded, stored, or sent.

export type Instrument = {
  slug: string;
  title: string;
  glyph: string;
  what: string;
  how: string[];
  // A static page in public/ shown in an iframe (the original was plain HTML and JavaScript).
  frame?: { src: string; height: number };
};

export const INSTRUMENTS: Instrument[] = [
  {
    slug: "hand-drums",
    title: "Hand drums",
    glyph: "🥁",
    what: "A drum kit in the air, with a loop tray you work with your hands.",
    how: [
      "Point a finger into a pad, or tap down with an open palm.",
      "Swipe an open palm sideways to change drums: kit, bongos, congas, electro.",
      "Pinch to start a loop, pinch again to close it; make a fist over a loop to grab it.",
    ],
    frame: { src: "/examples/hand-instruments/play/hand-drums/index.html", height: 640 },
  },
  {
    slug: "finger-sounds",
    title: "Finger sounds",
    glyph: "🤏",
    what: "Touch your thumb to a fingertip to play one of eight sounds, with a looper to layer beats.",
    how: [
      "Each hand has four pads: index, middle, ring, little finger.",
      "Change any pad's sound, or drop in an audio file of your own.",
      "R records into the loop, Space plays it; the keyboard plays the pads too.",
    ],
  },
  {
    slug: "gesture-camera",
    title: "Gesture camera",
    glyph: "👍",
    what: "A camera you run with your hands: the light, your size and place in the frame, the background.",
    how: [
      "Thumbs up lights the REC light, thumbs down puts it out (this copy records nothing).",
      "Pinch and move up or down for brighter or darker; pinch with both hands to resize and move yourself.",
      "A peace sign blurs the background.",
    ],
  },
  {
    slug: "air-band",
    title: "Air band",
    glyph: "🎺",
    what: "Up to five people play trumpet, piano, guitar, drums, and a whole-band filter, each in their own column of one webcam.",
    how: [
      "Choose the players and their instruments, then start the camera.",
      "Trumpet: one hand at your mouth, curl the other hand's fingers for the valves. Piano: bend a finger to play its note.",
      "Guitar: strum through the strings zone, hold up fingers on the other hand for the chord.",
    ],
    frame: { src: "/examples/hand-instruments/play/air-band/index.html", height: 980 },
  },
];

export function instrument(slug: string): Instrument {
  const found = INSTRUMENTS.find((i) => i.slug === slug);
  if (!found) throw new Error(`No hand instrument "${slug}"`);
  return found;
}
