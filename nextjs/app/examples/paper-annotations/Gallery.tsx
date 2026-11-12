import s from "./gallery.module.css";

const base = "/examples/paper-annotations/";
const clips = [
  { file: "annotation-table", title: "A shared surface", alt: "A participant works at a large paper map while an overhead view appears on the studio displays.", caption: "The paper stays on the table. The overhead camera makes the same working surface visible to the room." },
  { file: "map-annotations", title: "Make a connection", alt: "An overhead view of a participant drawing colored lines on a map among printed images and small cards.", caption: "Draw a route, place an image, connect two sites. Position and gesture carry information alongside the written words." },
  { file: "map-timelapse", title: "The map fills up", alt: "A time-lapse of people arranging images, cards, and annotations across a large map.", caption: "The shared map accumulates the group's choices. The time-lapse shows the arrangement changing." },
  { file: "syllabus-annotations", title: "A syllabus becomes a working document", alt: "Photographed pages of the Sex, Death, and the Hebrew Bible syllabus, covered with handwritten notes, arrows, and highlights.", caption: "In the syllabus activity, readers mark the course material itself: readings to return to, connections, and questions for a project." },
];

function Clip({ clip }: { clip: typeof clips[number] }) {
  return <figure className={s.figure}>
    <div className={s.heading}><h3>{clip.title}</h3></div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={base + clip.file + ".gif"} width={800} height={clip.file === "syllabus-annotations" ? 463 : 450} alt={clip.alt} />
    <figcaption>{clip.caption}</figcaption>
  </figure>;
}

export default function Gallery() {
  return <div className={s.gallery}>
    <section className={s.intro}><span>Paper → photograph → records → discussion</span><h2>The class makes something it can read together.</h2><p>A map, a timeline, or a syllabus starts as a shared object. Students add marks by hand. Those marks can then become records linked to the places, readings, or weeks they refer to.</p></section>
    <div className={s.clips}>{clips.map(clip => <Clip key={clip.file} clip={clip} />)}</div>
    <section className={s.database}><h2>From marginalia to a database</h2><p>The ANE 140 screenshot shows the next step: annotations organized into rows, with their source image, type of mark, text, location, bounding box, and ink color. A mark remains connected to the photographed page it came from.</p>
      <figure className={s.figure}><a href={base + "database.png"} target="_blank" rel="noreferrer" aria-label="Open the annotation database screenshot at full size">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base + "database.png"} width={2438} height={1464} alt="ANE 140 Airtable annotation table with source-image references, marginalia, arrows, underlines, transcribed annotation text, page locations, bounding boxes, and ink colors. Views can group the records by week or student." loading="lazy" />
      </a><figcaption>Open the image to inspect the fields. This is a screenshot of the activity's database; the pictured controls are part of the documentation.</figcaption></figure>
    </section>
    <section className={s.questions}><h2>What can the room ask now?</h2><ul><li>Which readings drew the most attention?</li><li>Where do the annotations converge, and where do they disagree?</li><li>Which connection would be worth pursuing in a final project?</li></ul><p>The useful loop is short: make a mark, preserve its context, then bring the room's observations back into the conversation.</p></section>
  </div>;
}
